import { Tutorial } from '../types';
// import { handleFirestoreError, OperationType } from './firestore-errors';

export async function getTutorials(): Promise<Tutorial[]> {
  return [];
}

export async function addTutorial(tutorial: Omit<Tutorial, 'id' | 'createdAt'>): Promise<Tutorial> {
  console.log('addTutorial called (mock)');
  return {
    ...tutorial,
    id: 'mock_id',
    createdAt: Date.now()
  };
}

export async function deleteTutorial(id: string): Promise<void> {
  console.log('deleteTutorial called (mock)');
}
