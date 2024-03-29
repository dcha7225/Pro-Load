import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import JournalTable from "../components/JournalTable";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { getAllKeys, getData } from "../../AsyncStor";

export default function Journal() {
    let today = new Date();
    today =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [dataSet, setDataSet] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const loadData = async () => {
                let allKeys = await getAllKeys();
                allKeys = allKeys.filter(
                    (item) => item !== "movements" && item !== "tutorial"
                );
                allKeys.sort((a, b) => new Date(a) - new Date(b));
                const dataPromises = allKeys.map(async (key) => {
                    const curData = await getData(key);
                    return { data: curData, date: key };
                });

                const data = await Promise.all(dataPromises);

                setDataSet(data);
                setCurrentIndex(data.length - 1);
            };

            loadData();
        }
    }, [isFocused]);

    let currentData;
    let currentDate;
    if (dataSet.length > 0) {
        currentData = dataSet[currentIndex]?.data;
        currentDate = dataSet[currentIndex]?.date;
    } else {
        currentData = [];
        currentDate = today;
    }
    return (
        <SafeAreaView style={styles.background}>
            <View style={styles.titleBar}>
                <View style={styles.pageControl}>
                    <View style={currentIndex - 1 < 0 && { opacity: 0 }}>
                        <Ionicons.Button
                            name="arrow-back-outline"
                            backgroundColor="black"
                            onPress={() => {
                                if (currentIndex - 1 >= 0) {
                                    setCurrentIndex(currentIndex - 1);
                                }
                            }}
                        />
                    </View>

                    <Text style={styles.date}>
                        {currentDate === today ? "Today" : currentDate}
                    </Text>
                    <View
                        style={
                            currentIndex + 1 >= dataSet.length && { opacity: 0 }
                        }
                    >
                        <Ionicons.Button
                            name="arrow-forward-outline"
                            backgroundColor="black"
                            onPress={() => {
                                if (currentIndex + 1 < dataSet.length) {
                                    setCurrentIndex(currentIndex + 1);
                                }
                            }}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.table}>
                <JournalTable data={currentData} />
            </View>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    titleBar: {
        width: "100%",
        height: "8%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        borderRadius: 2,
    },
    pageControl: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    date: {
        marginHorizontal: 20,
        fontSize: 18,
        fontWeight: "600",
    },
    table: {
        width: "100%",
        height: "87%",
    },
});
