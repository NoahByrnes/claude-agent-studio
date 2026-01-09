#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Email configuration from environment
const EMAIL_CONFIG = {
  imap: {
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
    host: process.env.IMAP_HOST || 'imap.gmail.com',
    port: parseInt(process.env.IMAP_PORT || '993'),
    tls: true,
  },
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  },
};

// Define tools
const tools: Tool[] = [
  {
    name: 'email_read_inbox',
    description: 'Read recent emails from inbox',
    inputSchema: {
      type: 'object',
      properties: {
        folder: {
          type: 'string',
          description: 'Email folder to read from',
          default: 'INBOX',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of emails to retrieve',
          default: 10,
        },
      },
    },
  },
  {
    name: 'email_read_message',
    description: 'Read a specific email message by ID',
    inputSchema: {
      type: 'object',
      properties: {
        message_id: {
          type: 'string',
          description: 'The email message ID',
        },
      },
      required: ['message_id'],
    },
  },
  {
    name: 'email_send',
    description: 'Send an email',
    inputSchema: {
      type: 'object',
      properties: {
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
        subject: {
          type: 'string',
          description: 'Email subject',
        },
        body: {
          type: 'string',
          description: 'Email body (plain text or HTML)',
        },
        html: {
          type: 'boolean',
          description: 'Whether body is HTML',
          default: false,
        },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'email_forward',
    description: 'Forward an email to another recipient',
    inputSchema: {
      type: 'object',
      properties: {
        message_id: {
          type: 'string',
          description: 'The email message ID to forward',
        },
        to: {
          type: 'string',
          description: 'Recipient email address',
        },
      },
      required: ['message_id', 'to'],
    },
  },
];

// Helper function to read emails via IMAP
async function readInbox(folder: string = 'INBOX', limit: number = 10): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(EMAIL_CONFIG.imap);
    const emails: any[] = [];

    imap.once('ready', () => {
      imap.openBox(folder, true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        const fetchRange = `${Math.max(1, box.messages.total - limit + 1)}:*`;
        const fetch = imap.seq.fetch(fetchRange, {
          bodies: '',
          struct: true,
        });

        fetch.on('message', (msg, seqno) => {
          let buffer = '';

          msg.on('body', (stream) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
          });

          msg.once('end', () => {
            simpleParser(buffer, (err, parsed) => {
              if (err) {
                console.error('Parse error:', err);
                return;
              }

              emails.push({
                id: parsed.messageId,
                from: parsed.from?.text,
                to: parsed.to?.text,
                subject: parsed.subject,
                date: parsed.date,
                body: parsed.text || '',
                html: parsed.html || '',
              });
            });
          });
        });

        fetch.once('end', () => {
          imap.end();
          resolve(emails);
        });

        fetch.once('error', (err) => {
          reject(err);
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
}

// Helper function to send email via SMTP
async function sendEmail(to: string, subject: string, body: string, isHtml: boolean = false): Promise<any> {
  const transporter = nodemailer.createTransport(EMAIL_CONFIG.smtp);

  const mailOptions = {
    from: EMAIL_CONFIG.smtp.auth.user,
    to,
    subject,
    ...(isHtml ? { html: body } : { text: body }),
  };

  return transporter.sendMail(mailOptions);
}

// Create MCP server
const server = new Server(
  {
    name: 'email-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'email_read_inbox': {
        const emails = await readInbox(args.folder, args.limit);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(emails, null, 2),
            },
          ],
        };
      }

      case 'email_send': {
        const result = await sendEmail(args.to, args.subject, args.body, args.html);
        return {
          content: [
            {
              type: 'text',
              text: `Email sent successfully to ${args.to}`,
            },
          ],
        };
      }

      case 'email_read_message':
      case 'email_forward':
        return {
          content: [
            {
              type: 'text',
              text: `Tool ${name} not yet implemented`,
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Email MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
