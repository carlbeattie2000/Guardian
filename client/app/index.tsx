import { Redirect, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { isBaseURLSet, isBaseURLSetSync } from "~/services/apiService";
import { AuthContext } from "~/contexts/Auth";
import { useContext } from "react";

export default function Index() {
	const [baseURLSet, setBaseURLSet] = useState(isBaseURLSetSync());
	const { session } = useContext(AuthContext);

	useFocusEffect(
		useCallback(() => {
			const isSet = isBaseURLSetSync();
			setBaseURLSet(isSet);
		}, []),
	);

	if (!baseURLSet) {
		return <Redirect href="/setup/base-url" />;
	}

	if (!session) {
		return <Redirect href="/authentication/login" />;
	}

	return <Redirect href="/(app)/" />;
}
