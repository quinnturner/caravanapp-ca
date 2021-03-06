import {
  Club,
  ClubReadingSchedule,
  ClubRecommendation,
  ClubTransformed,
  ClubTransformedRecommended,
  FilterAutoMongoKeys,
  GoogleBooks,
  ReadingState,
  Services,
  ShelfEntry,
} from '@caravanapp/types';

import { scheduleStrToDates } from '../../../common/scheduleStrToDates';

export function getCurrentSchedule(
  club: Club,
  currBook: ShelfEntry
): ClubReadingSchedule | null {
  if (club && club.schedules) {
    let schedule = club.schedules.find(s => s.shelfEntryId === currBook._id);
    if (schedule) {
      schedule = scheduleStrToDates(schedule);
      return schedule;
    }
  }
  return null;
}

export const transformClub = (
  club: Services.GetClubs['clubs'][0]
): ClubTransformed => {
  const transformedClub: ClubTransformed = {
    club,
  };
  if (club.newShelf.current.length > 0) {
    let schedule = club.schedules.find(
      sched => sched.shelfEntryId === club.newShelf.current[0]._id
    );
    if (schedule) {
      schedule = scheduleStrToDates(schedule);
      transformedClub.schedule = schedule;
    }
  }
  return transformedClub;
};

export const transformClubRecommended = (
  club: Services.GetClubs['clubs'][0],
  recommendation?: ClubRecommendation,
  isMember?: boolean
): ClubTransformedRecommended => {
  const transformedClub = transformClub(club);
  const transformedClubRecommended: ClubTransformedRecommended = {
    ...transformedClub,
    recommendation,
    isMember,
  };
  return transformedClubRecommended;
};

export function getWantToRead(club: Club): ShelfEntry[] {
  if (club && club.shelf) {
    const wantToRead = club.shelf.filter(
      book => book.readingState === 'notStarted'
    );
    return wantToRead;
  }
  return [];
}

export function getShelfFromGoogleBooks(
  selectedBooks: GoogleBooks.Item[],
  currentBookId?: string
) {
  if (selectedBooks) {
    const result = selectedBooks.map(book => {
      let readingState: ReadingState = 'notStarted';
      if (currentBookId && book.id === currentBookId) {
        readingState = 'current';
      }
      const res: FilterAutoMongoKeys<ShelfEntry> = {
        source: 'google',
        sourceId: book.id,
        readingState,
        title: book.volumeInfo.title,
        genres: book.volumeInfo.categories || [],
        author: (book.volumeInfo.authors || ['Unknown author']).join(', '),
        isbn:
          'industryIdentifiers' in book.volumeInfo
            ? book.volumeInfo.industryIdentifiers[0].identifier
            : undefined,
        publishedDate:
          'publishedDate' in book.volumeInfo
            ? book.volumeInfo.publishedDate
            : undefined,
        coverImageURL:
          'imageLinks' in book.volumeInfo
            ? book.volumeInfo.imageLinks.smallThumbnail
              ? book.volumeInfo.imageLinks.smallThumbnail
              : book.volumeInfo.imageLinks.thumbnail
              ? book.volumeInfo.imageLinks.thumbnail
              : require('../../../resources/generic-book-cover.jpg')
            : require('../../../resources/generic-book-cover.jpg'),
      };
      return res;
    });
    return result;
  } else {
    return [];
  }
}
