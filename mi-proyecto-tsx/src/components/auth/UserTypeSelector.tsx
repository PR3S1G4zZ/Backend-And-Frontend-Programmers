import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { User, Building2, Check } from "lucide-react";
import type { UserType } from "./constants";
import { USER_TYPES } from "./constants";

interface UserTypeSelectorProps {
  userType: UserType | null;
  onUserTypeSelect: (type: UserType) => void;
}

export function UserTypeSelector({ userType, onUserTypeSelect }: UserTypeSelectorProps) {
  return (
    <Card className="bg-[#1A1A1A] border-[#333333] hover-neon">
      <CardHeader>
        <CardTitle className="text-xl text-white text-center">¿Qué eres?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => onUserTypeSelect(USER_TYPES.PROGRAMMER)}
            className={`p-4 rounded-lg border-2 transition-all ${
              userType === USER_TYPES.PROGRAMMER
                ? 'border-[#00FF85] bg-[#00FF85]/10'
                : 'border-[#333333] hover:border-[#00FF85]/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                userType === USER_TYPES.PROGRAMMER ? 'bg-[#00FF85]' : 'bg-[#333333]'
              }`}>
                <User className={`h-6 w-6 ${
                  userType === USER_TYPES.PROGRAMMER ? 'text-[#0D0D0D]' : 'text-white'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold">Soy Programador</h3>
                <p className="text-gray-400 text-sm">Busco proyectos y oportunidades</p>
              </div>
              {userType === USER_TYPES.PROGRAMMER && (
                <Check className="h-5 w-5 text-[#00FF85]" />
              )}
            </div>
          </button>

          <button
            onClick={() => onUserTypeSelect(USER_TYPES.COMPANY)}
            className={`p-4 rounded-lg border-2 transition-all ${
              userType === USER_TYPES.COMPANY
                ? 'border-[#00FF85] bg-[#00FF85]/10'
                : 'border-[#333333] hover:border-[#00FF85]/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className={`p-3 rounded-full ${
                userType === USER_TYPES.COMPANY ? 'bg-[#00FF85]' : 'bg-[#333333]'
              }`}>
                <Building2 className={`h-6 w-6 ${
                  userType === USER_TYPES.COMPANY ? 'text-[#0D0D0D]' : 'text-white'
                }`} />
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold">Soy Empresa</h3>
                <p className="text-gray-400 text-sm">Busco contratar desarrolladores</p>
              </div>
              {userType === USER_TYPES.COMPANY && (
                <Check className="h-5 w-5 text-[#00FF85]" />
              )}
            </div>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}