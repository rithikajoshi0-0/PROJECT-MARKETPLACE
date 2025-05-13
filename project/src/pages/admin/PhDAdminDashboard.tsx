import React, { useState } from 'react';
import { Project } from '../../lib/supabase';
import { CheckCircle, XCircle, MessageSquare, AlertCircle, GraduationCap } from 'lucide-react';
import Button from '../../components/Button';

interface PhDAdminDashboardProps {
  papers: Project[];
  onApprove: (paperId: string) => Promise<void>;
  onReject: (paperId: string, feedback: string) => Promise<void>;
}

const PhDAdminDashboard: React.FC<PhDAdminDashboardProps> = ({
  papers,
  onApprove,
  onReject
}) => {
  const [selectedPaper, setSelectedPaper] = useState<Project | null>(null);
  const [feedback, setFeedback] = useState('');

  const pendingPapers = papers.filter(p => p.status === 'Pending' && p.type === 'phd');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">PhD Paper Reviews</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {pendingPapers.map(paper => (
          <div key={paper.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{paper.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{paper.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {paper.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-6 flex space-x-3">
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => onApprove(paper.id)}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setSelectedPaper(paper)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(`/phd-papers/${paper.id}`, '_blank')}
                  leftIcon={<MessageSquare className="h-4 w-4" />}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        ))}

        {pendingPapers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No pending PhD papers to review
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Reject PhD Paper
                  </h3>
                  <div className="mt-2">
                    <textarea
                      rows={4}
                      className="shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Provide feedback for rejection..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <Button
                  variant="danger"
                  onClick={() => {
                    onReject(selectedPaper.id, feedback);
                    setSelectedPaper(null);
                    setFeedback('');
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedPaper(null);
                    setFeedback('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhDAdminDashboard;
