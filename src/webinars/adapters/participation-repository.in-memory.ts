import { Participation } from 'src/webinars/entities/participation.entity';
import { IParticipationRepository } from 'src/webinars/ports/participation-repository.interface';

// Dépôt en mémoire pour gérer les participations
export class InMemoryParticipationRepository implements IParticipationRepository {
  private database: Participation[] = [];

  // Recherche les participations pour un webinaire donné
  async findByWebinarId(webinarId: string): Promise<Participation[]> {
    return this.database.filter(participation => participation.props.webinarId === webinarId);
  }

  // Enregistre une participation dans la base de données en mémoire.
  async save(participation: Participation): Promise<void> {
    this.database.push(participation);
  }
}