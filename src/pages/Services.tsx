
import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import ClientLayout from '@/components/layout/ClientLayout';
import ServicesList from '@/components/services/ServicesList';
import SuggestServiceForm from '@/components/services/SuggestServiceForm';
import RequestServiceForm from '@/components/services/RequestServiceForm';

type ViewMode = 'list' | 'suggest' | 'request';

const Services = () => {
  const { services, loading: servicesLoading } = useServices();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedService, setSelectedService] = useState<{ id: string; name: string } | null>(null);

  const handleSelectService = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService({ id: service.id, name: service.name });
      setViewMode('request');
    }
  };

  const handleSuggestService = () => {
    setViewMode('suggest');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedService(null);
  };

  if (servicesLoading) {
    return (
      <ClientLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="max-w-7xl mx-auto">
        {viewMode === 'list' && (
          <ServicesList 
            services={services}
            onSelectService={handleSelectService}
            onSuggestService={handleSuggestService}
          />
        )}
        
        {viewMode === 'suggest' && (
          <SuggestServiceForm onBack={handleBackToList} />
        )}
        
        {viewMode === 'request' && selectedService && (
          <RequestServiceForm 
            selectedServiceId={selectedService.id}
            selectedServiceName={selectedService.name}
            onBack={handleBackToList}
          />
        )}
      </div>
    </ClientLayout>
  );
};

export default Services;
