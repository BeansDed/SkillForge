import { db } from '@/lib/db';
import { Button } from '@/components/ui/Button';

export default async function AdminStorePage() {
  const items = await db.storeItem.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Store Items</h1>
        <Button>Add Item</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="bg-surface rounded-2xl p-6 border border-gray-800">
            <h3 className="font-bold">{item.name}</h3>
            <p className="text-gray-400 text-sm">{item.type}</p>
            <p className="text-cyan-500 font-bold mt-2">{item.priceGems} gems</p>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-8">
            No store items yet.
          </p>
        )}
      </div>
    </div>
  );
}
