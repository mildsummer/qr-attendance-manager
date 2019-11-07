import React, { PureComponent } from "react";
import firebase from 'firebase';
import * as PropTypes from 'prop-types';
import { FlatList, ActivityIndicator, RefreshControl, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import { HISTORY_TYPE_GUEST } from "../../functions/constants/common";
import colors from "../constants/colors";

const styles = StyleSheet.create({
  itemTitle: {
    fontWeight: "500",
    marginBottom: 4
  },
  itemSubtitle: {
    color: "rgba(0, 0, 0, 0.5)"
  },
  footer: {
    marginTop: 16,
    marginBottom: 16
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  }
});

export default class HistoryList extends PureComponent {
  render() {
    const { data, hasGetAll, isLoading, isRefreshing, refresh, startLoading } = this.props;
    const isLoadingEnabled = !isLoading && !hasGetAll;
    return (
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const data = item.data();
          const createdAt = new Date(data.createdAt.seconds * 1000);
          const createdAtString = `${createdAt.getFullYear()}年${createdAt.getMonth() +
          1}月${createdAt.getDate()}日 ${createdAt.getHours()}:${createdAt
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          return (
            <ListItem
              titleStyle={styles.itemTitle}
              title={
                data.type === HISTORY_TYPE_GUEST
                  ? `${data.hostName || "名前なし"}(${data.email})`
                  : `[${data.hostName || "名前なし"}]${data.guestName ||
                  "名前なし"}さん(${data.email})`
              }
              subtitle={createdAtString}
              subtitleStyle={styles.itemSubtitle}
              bottomDivider
            />
          );
        }}
        onRefresh={refresh}
        refreshing={isRefreshing}
        onEndReached={isLoadingEnabled ? startLoading : null}
        onEndReachedThreshold={0}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={colors.accent}
          />
        }
        ListFooterComponent={
          hasGetAll ? null : (
            <ActivityIndicator
              size="large"
              color={colors.accent}
              style={styles.footer}
            />
          )
        }
      />
    );
  }
}

HistoryList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.instanceOf(firebase.firestore.DocumentSnapshot)).isRequired,
  hasGetAll: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isRefreshing: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  startLoading: PropTypes.func.isRequired
};
