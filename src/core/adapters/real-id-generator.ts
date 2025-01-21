import { IIdGenerator } from 'src/core/ports/id-generator.interface';
import { v4 as uuidV4 } from 'uuid';

// Génère des identifiants uniques en utilisant la bibliothèque uuid.
export class RealIdGenerator implements IIdGenerator {
  generate() {
    return uuidV4();
  }
}
