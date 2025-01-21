import { Email, IMailer } from 'src/core/ports/mailer.interface';

export class FakeMailer implements IMailer {
  public readonly sentEmails: Email[] = [];

  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}