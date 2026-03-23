export default function TabGroup({ 
  tabs = [], 
  activeTab = null,
  onTabChange = null
}) {
  return (
    <div>
      <div className="flex gap-4 overflow-x-auto border-b border-secondary-700 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`px-6 py-3 font-semibold border-b-2 transition-all capitalize whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary-500 text-primary-400"
                : "border-transparent text-secondary-400 hover:text-secondary-300"
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      
      {tabs.find(tab => tab.id === activeTab)?.content}
    </div>
  );
}
