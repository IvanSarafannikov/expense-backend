import { createAdmin } from '../src/utils/admin.util';
import { createBaseExpenseCategories } from '../src/utils/base-expense-categories.util';

async function main() {
  await createAdmin();
  await createBaseExpenseCategories();
}

main();
