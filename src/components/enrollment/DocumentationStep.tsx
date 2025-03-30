
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Upload } from "lucide-react";

const DocumentationStep: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="id-upload">RG ou CNH (Frente)</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm font-medium">Arraste seu arquivo ou clique para fazer upload</div>
            <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
            <Input id="id-upload" type="file" className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('id-upload')?.click()}>
              Selecionar arquivo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="id-back-upload">RG (Verso) - se aplicável</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm font-medium">Arraste seu arquivo ou clique para fazer upload</div>
            <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
            <Input id="id-back-upload" type="file" className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('id-back-upload')?.click()}>
              Selecionar arquivo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="selfie-upload">Selfie com Documento</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm font-medium">Tire uma selfie segurando seu documento</div>
            <div className="text-xs text-gray-500">Suportamos JPG ou PNG até 5MB</div>
            <Input id="selfie-upload" type="file" className="hidden" />
            <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('selfie-upload')?.click()}>
              Selecionar arquivo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 bg-bestcode-50 p-4 rounded-md">
        <div className="flex items-start gap-2">
          <Check className="text-bestcode-600 mt-0.5" size={18} />
          <div>
            <h4 className="font-medium text-sm">Seus documentos estão seguros</h4>
            <p className="text-xs text-gray-600">
              Utilizamos criptografia de ponta-a-ponta e seus documentos são utilizados apenas para verificação de identidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationStep;
