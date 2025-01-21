import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

// Dépôt en mémoire pour gérer les webinaires
export class InMemoryWebinarRepository implements IWebinarRepository {
  constructor(public database: Webinar[] = []) {}

  // Ajoute un nouveau webinaire à la base de données en mémoire.
  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }

  // Recherche un webinaire par son identifiant
  async findById(id: string): Promise<Webinar | null> {
    const webinar = this.database.find(webinar => webinar.props.id === id);
    return webinar || null;
  }

  // Enregistre un webinaire dans la base de données en mémoire.
  async save(webinar: Webinar): Promise<void> {
    const index = this.database.findIndex(w => w.props.id === webinar.props.id);
    if (index !== -1) {
      this.database[index] = webinar;
    } else {
      this.database.push(webinar);
    }
  }
}