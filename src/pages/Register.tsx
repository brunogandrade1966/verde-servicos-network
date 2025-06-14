import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Leaf, ArrowLeft, Users, Briefcase, Shield, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const Register = () => {
  const { signUp } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [userType, setUserType] = useState(searchParams.get("type") || "client");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    document: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    setLoading(true);

    const userData = {
      name: formData.name,
      phone: formData.phone,
      document: formData.document,
      user_type: userType
    };

    const { error } = await signUp(formData.email, formData.password, userData);
    
    if (!error) {
      // Redirecionar para o dashboard após registro bem-sucedido
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const userTypes = [
    {
      id: "client",
      title: "Cliente",
      description: "Preciso de serviços ambientais",
      icon: Users
    },
    {
      id: "professional",
      title: "Profissional Ambiental",
      description: "Ofereço serviços ambientais",
      icon: Briefcase
    },
    {
      id: "admin",
      title: "Administrador",
      description: "Gerencio a plataforma",
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Ambiental Partners</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Criar Conta</CardTitle>
            <CardDescription className="text-center">
              Junte-se à nossa comunidade sustentável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de usuário */}
              <div className="space-y-3">
                <Label>Tipo de Conta</Label>
                <RadioGroup value={userType} onValueChange={setUserType}>
                  {userTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div key={type.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={type.id} id={type.id} disabled={loading} />
                        <Icon className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <Label htmlFor={type.id} className="font-medium cursor-pointer">
                            {type.title}
                          </Label>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Dados básicos */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">
                    {userType === "client" ? "CPF/CNPJ" : "CPF"}
                  </Label>
                  <Input
                    id="document"
                    placeholder={userType === "client" ? "000.000.000-00 ou 00.000.000/0001-00" : "000.000.000-00"}
                    value={formData.document}
                    onChange={(e) => handleInputChange("document", e.target.value)}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || formData.password !== formData.confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando Conta...
                  </>
                ) : (
                  "Criar Conta"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
