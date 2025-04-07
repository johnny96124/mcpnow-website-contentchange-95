
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type OnboardingStep = 
  | "discover"        // 用户需要发现并安装服务器
  | "create-instance" // 用户需要创建服务器实例
  | "add-to-profile"  // 用户需要将实例添加到配置文件
  | "assign-profile"  // 用户需要将配置文件分配给主机
  | "complete";       // 引导完成

interface OnboardingContextType {
  isOnboarding: boolean;
  currentStep: OnboardingStep;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  nextStep: () => void;
  setStep: (step: OnboardingStep) => void;
  selectedServerId: string | null;
  setSelectedServerId: (id: string | null) => void;
  selectedInstanceId: string | null;
  setSelectedInstanceId: (id: string | null) => void;
  selectedProfileId: string | null;
  setSelectedProfileId: (id: string | null) => void;
  selectedHostId: string | null;
  setSelectedHostId: (id: string | null) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("discover");
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);

  const startOnboarding = () => {
    setIsOnboarding(true);
    setCurrentStep("discover");
    navigate("/discovery");
  };

  const skipOnboarding = () => {
    setIsOnboarding(false);
    setCurrentStep("complete");
  };

  const nextStep = () => {
    switch(currentStep) {
      case "discover":
        setCurrentStep("create-instance");
        break;
      case "create-instance":
        setCurrentStep("add-to-profile");
        navigate("/profiles");
        break;
      case "add-to-profile":
        setCurrentStep("assign-profile");
        navigate("/hosts");
        break;
      case "assign-profile":
        setCurrentStep("complete");
        setIsOnboarding(false);
        break;
      default:
        break;
    }
  };

  const setStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarding,
        currentStep,
        startOnboarding,
        skipOnboarding,
        nextStep,
        setStep,
        selectedServerId,
        setSelectedServerId,
        selectedInstanceId,
        setSelectedInstanceId,
        selectedProfileId,
        setSelectedProfileId,
        selectedHostId,
        setSelectedHostId
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
