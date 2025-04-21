
import React from 'react';

export interface ClassInfo {
  id: string;
  name: string;
  description: string;
  startDate: string;
  studentsCount: number;
}

interface ClassItemProps {
  classInfo: ClassInfo;
  onEdit: (classInfo: ClassInfo) => void;
  onDelete: (id: string) => void;
}

const ClassItem: React.FC<ClassItemProps> = ({ classInfo, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{classInfo.name}</h3>
          <p className="text-gray-600 mb-2">{classInfo.description}</p>
          <div className="text-sm text-gray-500 flex flex-wrap gap-x-4">
            <span>Data de Início: {new Date(classInfo.startDate).toLocaleDateString('pt-BR')}</span>
            <span>Alunos: {classInfo.studentsCount}</span>
          </div>
        </div>
        <div className="flex items-center mt-2 md:mt-0">
          <button
            onClick={() => onEdit(classInfo)}
            className="bg-bestcode-100 text-bestcode-800 px-3 py-1 rounded mr-2 text-sm hover:bg-bestcode-200 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(classInfo.id)}
            className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassItem;
