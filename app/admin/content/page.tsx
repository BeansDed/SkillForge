import { Button } from '@/components/ui/Button';

export default function AdminContentPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Management</h1>
        <Button>Create Lesson</Button>
      </div>
      <div className="bg-surface rounded-2xl p-8 border border-gray-800 text-center">
        <p className="text-gray-400 mb-4">No lessons created yet.</p>
        <p className="text-sm text-gray-500">
          Click &quot;Create Lesson&quot; to add your first lesson.
        </p>
      </div>
    </div>
  );
}
