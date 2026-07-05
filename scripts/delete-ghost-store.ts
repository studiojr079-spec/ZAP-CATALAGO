import { deleteStore } from '../src/lib/db';

async function removeGhostData() {
  try {
    console.log('Deleting ghost store: store_wjotsvesc');
    await deleteStore('store_wjotsvesc');
    console.log('Ghost store deleted successfully.');
  } catch (error) {
    console.error('Error deleting ghost store:', error);
  }
}

removeGhostData();
