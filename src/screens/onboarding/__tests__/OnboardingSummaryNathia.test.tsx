import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OnboardingSummaryNathia from '../OnboardingSummaryNathia';
import { useNathJourneyOnboardingStore } from '@/state/nath-journey-onboarding-store';
import { NavigationContainer } from '@react-navigation/native';

// Mock the store
jest.mock('@/state/nath-journey-onboarding-store', () => ({
  useNathJourneyOnboardingStore: jest.fn(),
}));

// Mock safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
};

describe('OnboardingSummaryNathia', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useNathJourneyOnboardingStore as unknown as jest.Mock).mockImplementation((selector) => {
      const state = {
        data: {
          stage: 'GRAVIDA_1',
          concerns: ['ANSIEDADE_MEDO'],
          dailyCheckIn: true,
          checkInHour: 21,
          dateIso: '2026-10-01T00:00:00.000Z',
        },
        needsExtraCare: () => false,
        setCurrentScreen: jest.fn(),
        getSeasonName: () => 'Eu por mim mesma',
        formatCheckInTime: (h: number) => `${h}h`,
        getCheckInTime: () => '21:00',
        canProceed: () => true,
      };
      return selector(state);
    });
  });

  it('renders correctly with user data', () => {
    const { getByText } = render(
      <NavigationContainer>
        <OnboardingSummaryNathia 
          navigation={mockNavigation as unknown as never} 
          route={{} as never} 
        />
      </NavigationContainer>
    );

    expect(getByText('Tudo pronto! 🎉')).toBeTruthy();
    expect(getByText('Vou te acompanhar do seu jeito')).toBeTruthy();
    expect(getByText('Ansiedade e medo')).toBeTruthy();
    expect(getByText('Check-in diário às 21h')).toBeTruthy();
    expect(getByText('Temporada "Eu por mim mesma"')).toBeTruthy();
  });

  it('navigates to paywall on continue', async () => {
    const { getByText } = render(
      <NavigationContainer>
        <OnboardingSummaryNathia 
          navigation={mockNavigation as unknown as never} 
          route={{} as never} 
        />
      </NavigationContainer>
    );

    const continueButton = getByText('Vamos juntas');
    fireEvent.press(continueButton);

    await waitFor(() => {
      expect(mockNavigation.navigate).toHaveBeenCalledWith('OnboardingPaywall');
    });
  });
});
