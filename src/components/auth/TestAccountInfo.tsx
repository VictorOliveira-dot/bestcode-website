
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const TestAccountInfo = () => {
  return (
    <div className="mt-4">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription className="text-xs">
          <strong>Informações de Registro:</strong>
          <div className="mt-1">
            Você pode criar uma nova conta selecionando um dos seguintes tipos:
            <ul className="list-disc pl-5 mt-1">
              <li><strong>Estudante:</strong> Acesso a dashboard de aluno, cursos e materiais.</li>
              <li><strong>Professor:</strong> Acesso a criação de aulas e gerenciamento de alunos.</li>
              <li><strong>Administrador:</strong> Acesso completo ao sistema, incluindo gerenciamento de professores.</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TestAccountInfo;
