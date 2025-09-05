import "~/global.css";

import {
	DarkTheme,
	DefaultTheme,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Appearance, Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { AuthContext, AuthProvider } from "~/contexts/Auth";

import Reactotron from "reactotron-react-native";
import {
	BASE_URL,
	isBaseURLSet,
	isBaseURLSetSync,
} from "~/services/apiService";
import RightHeader from "~/components/Header";
Reactotron.configure({}).useReactNative().connect();

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

const usePlatformSpecificSetup = Platform.select({
	web: useSetWebBackgroundClassName,
	android: useSetAndroidNavigationBar,
	default: noop,
});

export default function RootLayout() {
	usePlatformSpecificSetup();
	const { isDarkColorScheme } = useColorScheme();

	return (
		<AuthProvider>
			<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
				<StatusBar style={isDarkColorScheme ? "light" : "dark"} />
				<AppStack />
				<PortalHost />
			</ThemeProvider>
		</AuthProvider>
	);
}

function AppStack() {
	const segments = useSegments();
	const { session, checkAuthed, refreshToken } = React.use(AuthContext);
	const [baseURLSet, setBaseURLSet] = React.useState(isBaseURLSetSync());

	React.useEffect(() => {
		checkAuthed();
		refreshToken();
	}, [segments]);

	React.useEffect(() => {
		(async () => {
			const isSet = await isBaseURLSet();
			setBaseURLSet(isSet);
		})();
	}, [BASE_URL, session, segments]);

	return (
		<Stack>
			<Stack.Screen name="index" options={{ headerShown: false }} />

			<Stack.Protected guard={baseURLSet && !!session}>
				<Stack.Screen
					name="(app)/index"
					options={{
						title: "Dashboard",
						headerRight: () => <RightHeader />,
					}}
				/>
				<Stack.Screen
					name="(app)/(reports)/index"
					options={{
						title: "Reports",
						headerRight: () => <RightHeader />,
					}}
				/>
				<Stack.Screen
					name="(app)/(reports)/new"
					options={{
						title: "New Report",
						headerRight: () => <RightHeader />,
					}}
				/>
				<Stack.Screen
					name="(app)/(reports)/[report_id]"
					options={{
						title: "Report",
						headerRight: () => <RightHeader />,
					}}
				/>
			</Stack.Protected>

			<Stack.Protected guard={baseURLSet && !session}>
				<Stack.Screen
					name="authentication/login"
					options={{
						title: "Login",
						headerRight: () => <RightHeader />,
					}}
				/>
				<Stack.Screen
					name="authentication/register"
					options={{
						title: "Register",
						headerRight: () => <RightHeader />,
					}}
				/>
			</Stack.Protected>

			<Stack.Screen
				name="setup/base-url"
				options={{
					title: "Server Setup",
					presentation: "modal",
					headerRight: () => <RightHeader />,
				}}
			/>
		</Stack>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;

function useSetWebBackgroundClassName() {
	useIsomorphicLayoutEffect(() => {
		// Adds the background color to the html element to prevent white background on overscroll.
		document.documentElement.classList.add("bg-background");
	}, []);
}

function useSetAndroidNavigationBar() {
	React.useLayoutEffect(() => {
		setAndroidNavigationBar(Appearance.getColorScheme() ?? "light");
	}, []);
}

function noop() {}
