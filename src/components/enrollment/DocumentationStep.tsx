
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Upload, XCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Progress } from "@/components/ui/progress";

interface UploadStatus {
  isUploading: boolean;
  progress: number;
  success: boolean;
  error: boolean;
  fileName: string;
}

const DocumentationStep: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({
    idFront: { isUploading: false, progress: 0, success: false, error: false, fileName: "" },
    idBack: { isUploading: false, progress: 0, success: false, error: false, fileName: "" },
    selfie: { isUploading: false, progress: 0, success: false, error: false, fileName: "" }
  });
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isCreatingApplication, setIsCreatingApplication] = useState(false);
  
  const { user } = useAuth();

  // Verificar se já existe uma application ou criar uma nova
  useEffect(() => {
    const checkOrCreateApplication = async () => {
      if (!user) return;
      
      try {
        setIsCreatingApplication(true);
        
        // Verificar se já existe uma application
        const { data: existingApplication, error: fetchError } = await supabase
          .from('student_applications')
          .select('id')
          .eq('user_id', user.id)
          .single();
          
        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }
        
        if (existingApplication) {
          // Se já existe uma application, armazena o ID
          setApplicationId(existingApplication.id);
        } else {
          // Se não existe, cria uma nova application
          // Primeiro, buscar dados do perfil do usuário
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, phone')
            .eq('id', user.id)
            .single();
            
          // Criar uma nova application
          const fullName = profileData ? 
            `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() : 
            user.email?.split('@')[0] || 'Estudante';
            
          const { data: newApplication, error: insertError } = await supabase
            .from('student_applications')
            .insert({
              user_id: user.id,
              full_name: fullName,
              email: user.email,
              phone: profileData?.phone || null,
              course: 'Formação Completa em QA',
              status: 'pending'
            })
            .select('id')
            .single();
            
          if (insertError) throw insertError;
          
          setApplicationId(newApplication.id);
          console.log("Nova application criada com ID:", newApplication.id);
        }
      } catch (error) {
        console.error("Erro ao verificar/criar application:", error);
        toast.error("Erro ao preparar o sistema para upload de documentos");
      } finally {
        setIsCreatingApplication(false);
      }
    };
    
    checkOrCreateApplication();
  }, [user]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!user) {
      toast.error("Você precisa estar logado para enviar documentos");
      return;
    }
    
    if (!applicationId) {
      toast.error("Preparando o sistema para upload. Por favor, tente novamente em alguns instantes.");
      return;
    }
    
    // Validação do tipo e tamanho de arquivo
    const fileExt = file.name.split('.').pop();
    const allowedTypes = documentType === 'selfie' ? ['jpg', 'jpeg', 'png'] : ['jpg', 'jpeg', 'png', 'pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(fileExt?.toLowerCase() || '')) {
      toast.error(`Formato de arquivo não suportado. Use ${allowedTypes.join(', ')}`);
      return;
    }
    
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande. O tamanho máximo é 5MB");
      return;
    }
    
    // Iniciar state de upload
    setUploadStatus(prev => ({
      ...prev,
      [documentType]: {
        ...prev[documentType],
        isUploading: true,
        progress: 0,
        fileName: file.name,
        success: false,
        error: false
      }
    }));
    
    try {
      // Definir caminho no storage
      const filePath = `${user.id}/${applicationId}/${documentType}_${Date.now()}.${fileExt}`;
      
      // Iniciar intervalo para simular o progresso do upload
      let progressCounter = 0;
      const progressInterval = setInterval(() => {
        progressCounter += 5;
        if (progressCounter > 95) {
          clearInterval(progressInterval);
        }
        
        setUploadStatus(prev => ({
          ...prev,
          [documentType]: {
            ...prev[documentType],
            progress: progressCounter
          }
        }));
      }, 100);
      
      // Realizar o upload sem callback de progresso
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      // Limpar o intervalo após o upload concluir (com sucesso ou erro)
      clearInterval(progressInterval);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Obter a URL do arquivo
      const { data: urlData } = supabase.storage
        .from('student-documents')
        .getPublicUrl(filePath);
      
      // Salvar na tabela student_documents
      const documentName = documentType === 'idFront' ? 'RG/CNH (Frente)' :
                          documentType === 'idBack' ? 'RG (Verso)' : 
                          'Selfie com documento';
      
      const { error: documentError } = await supabase
        .from('student_documents')
        .insert({
          application_id: applicationId,
          name: documentName,
          file_url: urlData.publicUrl
        });
      
      if (documentError) {
        throw documentError;
      }
      
      // Upload finalizado com sucesso
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          isUploading: false,
          progress: 100,
          success: true,
          error: false
        }
      }));
      
      toast.success(`Documento "${documentName}" enviado com sucesso!`);
    } catch (error: any) {
      console.error("Erro no upload:", error);
      setUploadStatus(prev => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          isUploading: false,
          error: true,
          success: false
        }
      }));
      toast.error(`Erro ao enviar documento: ${error.message || error}`);
    }
  };

  const getDocumentStatusIcon = (documentType: string) => {
    const status = uploadStatus[documentType];
    
    if (status.isUploading) {
      return (
        <div className="flex flex-col items-center">
          <Upload className="h-6 w-6 text-blue-500 animate-pulse" />
          <Progress value={status.progress} className="h-1 w-24 mt-1" />
        </div>
      );
    }
    
    if (status.success) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    }
    
    if (status.error) {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
    
    return <Upload className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {isCreatingApplication && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-md mb-4 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-amber-700"></div>
          <p className="text-sm">Preparando sistema para upload de documentos...</p>
        </div>
      )}
      
      {!applicationId && !isCreatingApplication && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="text-sm font-medium">Não foi possível inicializar o upload de documentos</p>
          <p className="text-xs mt-1">Por favor, tente recarregar a página ou entre em contato com o suporte.</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="id-upload">RG ou CNH (Frente) *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            {getDocumentStatusIcon('idFront')}
            <div className="text-sm font-medium">
              {uploadStatus.idFront.fileName || "Arraste seu arquivo ou clique para fazer upload"}
            </div>
            <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
            <Input 
              id="id-upload" 
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'idFront')}
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={uploadStatus.idFront.isUploading || uploadStatus.idFront.success || !applicationId || isCreatingApplication}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('id-upload')?.click()}
              disabled={uploadStatus.idFront.isUploading || uploadStatus.idFront.success || !applicationId || isCreatingApplication}
            >
              {uploadStatus.idFront.success ? "Documento enviado" : "Selecionar arquivo"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="id-back-upload">RG (Verso) - se aplicável</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            {getDocumentStatusIcon('idBack')}
            <div className="text-sm font-medium">
              {uploadStatus.idBack.fileName || "Arraste seu arquivo ou clique para fazer upload"}
            </div>
            <div className="text-xs text-gray-500">Suportamos JPG, PNG ou PDF até 5MB</div>
            <Input 
              id="id-back-upload" 
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'idBack')}
              accept=".jpg,.jpeg,.png,.pdf"
              disabled={uploadStatus.idBack.isUploading || uploadStatus.idBack.success || !applicationId || isCreatingApplication}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('id-back-upload')?.click()}
              disabled={uploadStatus.idBack.isUploading || uploadStatus.idBack.success || !applicationId || isCreatingApplication}
            >
              {uploadStatus.idBack.success ? "Documento enviado" : "Selecionar arquivo"}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="selfie-upload">Selfie com Documento *</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            {getDocumentStatusIcon('selfie')}
            <div className="text-sm font-medium">
              {uploadStatus.selfie.fileName || "Tire uma selfie segurando seu documento"}
            </div>
            <div className="text-xs text-gray-500">Suportamos JPG ou PNG até 5MB</div>
            <Input 
              id="selfie-upload" 
              type="file" 
              className="hidden" 
              onChange={(e) => handleFileChange(e, 'selfie')}
              accept=".jpg,.jpeg,.png"
              disabled={uploadStatus.selfie.isUploading || uploadStatus.selfie.success || !applicationId || isCreatingApplication}
            />
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => document.getElementById('selfie-upload')?.click()}
              disabled={uploadStatus.selfie.isUploading || uploadStatus.selfie.success || !applicationId || isCreatingApplication}
            >
              {uploadStatus.selfie.success ? "Documento enviado" : "Selecionar arquivo"}
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

      <div className="text-sm text-gray-500 pt-2">
        * Documentos obrigatórios
      </div>
    </div>
  );
};

export default DocumentationStep;
