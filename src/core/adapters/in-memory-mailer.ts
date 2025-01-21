import { Email, IMailer } from 'src/core/ports/mailer.interface';

// Stocke les emails envoyés en mémoire, utile pour les tests.
export class InMemoryMailer implements IMailer {
  public readonly sentEmails: Email[] = [];

  // Enregistre l'email envoyé.
  async send(email: Email): Promise<void> {
    this.sentEmails.push(email);
  }
}
