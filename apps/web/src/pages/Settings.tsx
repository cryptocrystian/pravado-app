export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text">Settings</h1>
        <p className="text-text/60 mt-2">Configure your PRAVADO workspace</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Account</h3>
          <p className="text-text/60">Profile and subscription settings</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Integrations</h3>
          <p className="text-text/60">Connect external tools and platforms</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <p className="text-text/60">Manage alert preferences</p>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Team</h3>
          <p className="text-text/60">User management and permissions</p>
        </div>
      </div>
    </div>
  )
}