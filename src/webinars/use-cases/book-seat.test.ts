import { InMemoryParticipationRepository } from 'src/webinars/adapters/participation-repository.in-memory';
import { InMemoryUser } from 'src/users/adapters/in-memory-users';
import { InMemoryWebinarRepository } from 'src/webinars/adapters/webinar-repository.in-memory';
import { BookSeat } from 'src/webinars/use-cases/book-seat';
import { User } from 'src/users/entities/user.entity';
import { Webinar } from 'src/webinars/entities/webinar.entity';
import { Participation } from 'src/webinars/entities/participation.entity';
import { InMemoryMailer } from 'src/core/adapters/in-memory-mailer';

describe('Feature: Book seat', () => {
  let webinarRepository: InMemoryWebinarRepository;
  let participationRepository: InMemoryParticipationRepository;
  let userRepository: InMemoryUser;
  let mailer: InMemoryMailer;
  let useCase: BookSeat;

  const user = new User({
    id: 'user-1',
    email: 'user1@example.com',
    password: 'mypassword',
  });

  const webinar = new Webinar({
    id: 'webinar-1',
    organizerId: 'organizer-1',
    title: 'Test Webinar',
    startDate: new Date('2025-02-01T10:00:00.000Z'),
    endDate: new Date('2025-02-01T11:00:00.000Z'),
    seats: 2,
  });

  beforeEach(() => {
    webinarRepository = new InMemoryWebinarRepository();
    participationRepository = new InMemoryParticipationRepository();
    userRepository = new InMemoryUser();
    mailer = new InMemoryMailer();

    useCase = new BookSeat(
      participationRepository,
      userRepository,
      webinarRepository,
      mailer,
    );

    webinarRepository.save(webinar);
    userRepository.save(user);
  });

  describe('Scenario: Webinar does not exist', () => {
    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: 'non-existent', user }),
      ).rejects.toThrow('Webinar not found');
    });
  });

  describe('Scenario: User already participating', () => {
    beforeEach(() => {
      const participation = new Participation({
        userId: user.props.id,
        webinarId: webinar.props.id,
      });
      participationRepository.save(participation);
    });

    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: webinar.props.id, user }),
      ).rejects.toThrow('User is already participating in this webinar');
    });
  });

  describe('Scenario: No seats available', () => {
    beforeEach(() => {
      const participation1 = new Participation({
        userId: 'user-2',
        webinarId: webinar.props.id,
      });
      const participation2 = new Participation({
        userId: 'user-3',
        webinarId: webinar.props.id,
      });
      participationRepository.save(participation1);
      participationRepository.save(participation2);
    });

    it('should throw an error', async () => {
      await expect(
        useCase.execute({ webinarId: webinar.props.id, user }),
      ).rejects.toThrow('No seats available');
    });
  });

  describe('Scenario: Successful booking', () => {
    it('should book a seat in a webinar', async () => {
      await useCase.execute({ webinarId: webinar.props.id, user });

      const participations = await participationRepository.findByWebinarId(webinar.props.id);
      expect(participations).toHaveLength(1);
      expect(participations[0].props.userId).toBe(user.props.id);
    });

    it('should send an email to the organizer', async () => {
      await useCase.execute({ webinarId: webinar.props.id, user });

      expect(mailer.sentEmails).toHaveLength(1);
      expect(mailer.sentEmails[0].to).toBe(webinar.props.organizerId);
      expect(mailer.sentEmails[0].subject).toBe('New participant');
      expect(mailer.sentEmails[0].body).toBe(`User ${user.props.email} has booked a seat in your webinar.`);
    });
  });
});