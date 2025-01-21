import { User } from 'src/users/entities/user.entity';
import { IUserRepository } from 'src/users/ports/user-repository.interface';

// Implémentation en mémoire du dépôt d'utilisateurs. Utile pour les tests.
export class InMemoryUser implements IUserRepository {
  public readonly users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(user => user.props.id === id);
    return user || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}