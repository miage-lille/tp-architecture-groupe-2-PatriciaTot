import { IMailer } from 'src/core/ports/mailer.interface';
import { Executable } from 'src/shared/executable';
import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';
import { Participation } from 'src/webinars/entities/participation.entity';

// Données nécessaires pour réserver une place
type Request = {
  webinarId: string; // Identifiant du webinaire
  user: User; // Utilisateur qui réserve la place
};
type Response = void;

export class BookSeat implements Executable<Request, Response> {
  constructor(
    private readonly participationRepository: IParticipationRepository,
    private readonly userRepository: IUserRepository,
    private readonly webinarRepository: IWebinarRepository,
    private readonly mailer: IMailer,
  ) {}

  async execute({ webinarId, user }: Request): Promise<Response> {
    // Vérification de l'existence du webinaire
    const webinar = await this.webinarRepository.findById(webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }

    // Vérification de la participation de l'utilisateur
    const participations = await this.participationRepository.findByWebinarId(webinarId);
    if (participations.some(p => p.props.userId === user.props.id)) {
      throw new Error('User is already participating in this webinar');
    }

    // Vérification de la disponibilité des places
    if (participations.length >= webinar.props.seats) {
      throw new Error('No seats available');
    }

    // Enregistrement de la participation
    const participation = new Participation({ userId: user.props.id, webinarId });
    await this.participationRepository.save(participation);

    // Envoi de l'email à l'organisateur
    await this.mailer.send({
      to: webinar.props.organizerId,
      subject: 'New participant',
      body: `User ${user.props.email} has booked a seat in your webinar.`,
    });
  }
}