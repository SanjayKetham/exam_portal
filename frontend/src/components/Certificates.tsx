import React from 'react';
import { Download, Award, Calendar, ExternalLink } from 'lucide-react';
import { Certificate } from '../types';

interface CertificatesProps {
  certificates: Certificate[];
}

const Certificates: React.FC<CertificatesProps> = ({ certificates }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Certificates</h1>
        <p className="text-gray-600">Download and share your achievement certificates.</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Yet</h3>
          <p className="text-gray-600">Complete exams with passing grades to earn certificates.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Certificate of Completion
                  </h3>
                  <h4 className="text-lg text-gray-700 mb-3">{certificate.examTitle}</h4>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800`}>
                      Grade: {certificate.grade}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                      <ExternalLink className="w-4 h-4" />
                      View Online
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;