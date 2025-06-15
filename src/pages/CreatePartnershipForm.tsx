
import { useSearchParams } from 'react-router-dom';
import CreatePartnershipDemandForm from '@/components/partnerships/CreatePartnershipDemandForm';
import ClientLayout from '@/components/layout/ClientLayout';

const CreatePartnershipForm = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  return (
    <ClientLayout>
      <CreatePartnershipDemandForm preselectedServiceId={serviceId} />
    </ClientLayout>
  );
};

export default CreatePartnershipForm;
