import { differenceInDays } from 'date-fns';
import { Entity } from 'src/shared/entity';

type WebinarProps = {
  id: string;
  organizerId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};
export class Webinar extends Entity<WebinarProps> {
  // Vérifie si le webinaire est trop tôt
  isTooSoon(now: Date): boolean {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < 3;
  }

  // Vérifie si le webinaire est trop tard
  hasTooManySeats(): boolean {
    return this.props.seats > 1000;
  }

  // Vérifie si le webinaire a assez de places
  hasNotEnoughSeats(): boolean {
    return this.props.seats < 1;
  }

  // Vérifie si l'utilisateur est l'organisateur du webinaire
  isOrganizer(userId: string) {
    return this.props.organizerId === userId;
  }
}
