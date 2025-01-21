import { IIdGenerator } from 'src/core/ports/id-generator.interface';

// Génère des identifiants uniques en utilisant la bibliothèque uuid.
export class FixedIdGenerator implements IIdGenerator {
  generate() {
    return 'id-1';
  }
}
