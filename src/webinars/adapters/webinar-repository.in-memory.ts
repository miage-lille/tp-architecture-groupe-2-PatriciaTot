import { Webinar } from 'src/webinars/entities/webinar.entity';
import { IWebinarRepository } from 'src/webinars/ports/webinar-repository.interface';

export class InMemoryWebinarRepository implements IWebinarRepository {
  constructor(public database: Webinar[] = []) {}

  async create(webinar: Webinar): Promise<void> {
    this.database.push(webinar);
  }

  async findById(id: string): Promise<Webinar | null> {
    const webinar = this.database.find(webinar => webinar.props.id === id);
    return webinar || null;
  }

  async save(webinar: Webinar): Promise<void> {
    const index = this.database.findIndex(w => w.props.id === webinar.props.id);
    if (index !== -1) {
      this.database[index] = webinar;
    } else {
      this.database.push(webinar);
    }
  }
}