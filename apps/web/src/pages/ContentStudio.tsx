import { Edit3, FileText, Calendar } from 'lucide-react'

export function ContentStudio() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            Content Studio
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, edit, and manage your content
          </p>
        </div>
        
        <button className="btn-primary">
          New Content
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border text-center">
          <FileText className="w-8 h-8 text-ai-teal mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary dark:text-text-primary-dark">
            Blog Post
          </h3>
          <p className="text-sm text-gray-500 mt-1">Create a new blog post</p>
        </div>
        
        <div className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border text-center">
          <Edit3 className="w-8 h-8 text-ai-teal mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary dark:text-text-primary-dark">
            Press Release
          </h3>
          <p className="text-sm text-gray-500 mt-1">Draft a press release</p>
        </div>
        
        <div className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border text-center">
          <Calendar className="w-8 h-8 text-ai-teal mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary dark:text-text-primary-dark">
            Social Post
          </h3>
          <p className="text-sm text-gray-500 mt-1">Schedule social content</p>
        </div>
        
        <div className="bg-white dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-border text-center">
          <FileText className="w-8 h-8 text-ai-teal mx-auto mb-3" />
          <h3 className="font-semibold text-text-primary dark:text-text-primary-dark">
            Email Campaign
          </h3>
          <p className="text-sm text-gray-500 mt-1">Create email content</p>
        </div>
      </div>

      {/* Recent Content */}
      <div className="bg-white dark:bg-surface-dark rounded-lg p-6 shadow-sm border border-border">
        <h2 className="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4">
          Recent Content
        </h2>
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No content yet. Create your first piece to get started.</p>
        </div>
      </div>
    </div>
  )
}