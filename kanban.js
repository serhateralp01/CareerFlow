const KanbanComponents = {};

KanbanComponents.KanbanCard = function({ job, onDragStart }) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing"
    >
      <h4 className="font-bold text-sm text-gray-800">{job.Company}</h4>
      <p className="text-xs text-gray-600">{job.Title}</p>
      <div className={`text-xs mt-2 font-medium ${getDeadlineClass(job.AppDeadline)}`}>
        Deadline: {job.AppDeadline || 'N/A'}
      </div>
    </div>
  );
}

KanbanComponents.KanbanColumn = function({ title, jobs, onDragOver, onDrop, onDragStart }) {
  return (
    <div 
      className="bg-gray-100 rounded-xl p-3 w-64 md:w-72 flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <h3 className="font-semibold text-sm text-gray-700 mb-3 px-1">{title} ({jobs.length})</h3>
      <div className="space-y-2 min-h-[100px]">
        {jobs.map(job => <KanbanComponents.KanbanCard key={job.id} job={job} onDragStart={onDragStart} />)}
      </div>
    </div>
  );
}

KanbanComponents.KanbanBoard = function({ jobs, setJobs }) {
  const [showBoard, setShowBoard] = React.useState(false);

  const handleDragStart = (e, jobId) => {
    e.dataTransfer.setData("jobId", jobId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    const jobId = e.dataTransfer.getData("jobId");
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const newStatus = targetStatus === "Backlog" ? job.Status : targetStatus;
        return { ...job, Status: newStatus };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const boardJobs = jobs.filter(j => KANBAN_COLUMNS.slice(1).includes(j.Status));
  const backlogJobs = jobs.filter(j => !KANBAN_COLUMNS.slice(1).includes(j.Status));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150" onClick={() => setShowBoard(!showBoard)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Icon name="trello" className="w-6 h-6 text-blue-500"/>
            <h2 className="text-xl font-semibold text-gray-800">Kanban View</h2>
          </div>
          <Icon name={showBoard ? "chevron-up" : "chevron-down"} className="w-6 h-6" />
        </div>
      </div>
      {showBoard && (
        <div className="px-6 pb-6 pt-2 overflow-x-auto">
          <div className="flex space-x-4">
            <KanbanComponents.KanbanColumn 
                title="Backlog" 
                jobs={backlogJobs} 
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                onDragStart={handleDragStart} 
            />
            {KANBAN_COLUMNS.slice(1).map(status => (
              <KanbanComponents.KanbanColumn
                key={status}
                title={status}
                jobs={boardJobs.filter(job => job.Status === status)}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 