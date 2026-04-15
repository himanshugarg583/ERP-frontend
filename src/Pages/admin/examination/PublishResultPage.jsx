import React from 'react';
import Sidebar from '../Sidebar';
import Header from '../../../components/comman_components/Header';
import PublishResult from '../../../components/examanitaion/PublishResult';

const PublishResultPage = () => {
  return (
    <div className="bg-slate-200 flex AddStudent">
      <Sidebar />

      <div
        className="overflow-auto relative z-1 flex-col"
        style={{
          height: '95vh',
          width: '100vw',
          gap: '10px',
          display: 'flex',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Header />

        <main>
          <PublishResult />
        </main>
      </div>
    </div>
  );
};

export default PublishResultPage;
