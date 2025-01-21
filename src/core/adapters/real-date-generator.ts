import { IDateGenerator } from 'src/core/ports/date-generator.interface';

// Fournit la date et l'heure actuelles.
export class RealDateGenerator implements IDateGenerator {
  now(): Date {
    return new Date();
  }
}
