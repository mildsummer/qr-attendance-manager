import React, { Component } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  StyleSheet
} from "react-native";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { getHistory, refreshHistory } from "../redux";
import { HISTORY_TYPE_GUEST } from "../../functions/constants/common";
import colors from "../common/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%"
  },
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

class List extends Component {
  state = {
    isLoading: false,
    isRefreshing: false
  };

  componentDidMount() {
    const { data } = this.props;
    if (!data) {
      this.startLoading();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        isLoading: false,
        isRefreshing: false
      });
    }
  }

  startLoading = () => {
    const { data, getHistory } = this.props;
    this.setState(
      {
        isLoading: true
      },
      () => {
        getHistory(20, data && data.length ? data[data.length - 1] : null);
      }
    );
  };

  refresh = () => {
    const { refreshHistory } = this.props;
    this.setState(
      {
        isRefreshing: true
      },
      () => {
        refreshHistory();
      }
    );
  };

  render() {
    const { data, hasGetAll } = this.props;
    const { isLoading, isRefreshing } = this.state;
    const isLoadingEnabled = !isLoading && !hasGetAll;
    return (
      <View style={styles.container}>
        {data ? (
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
            onRefresh={this.refresh}
            refreshing={isRefreshing}
            onEndReached={isLoadingEnabled ? this.startLoading : null}
            onEndReachedThreshold={0}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={this.refresh}
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
        ) : (
          <ActivityIndicator
            size="large"
            color={colors.accent}
            style={styles.loading}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  dbUser: state.user.dbData,
  data: state.user.history,
  hasGetAll: state.user.hasGetAllHistory
});

const mapDispatchToProps = {
  getHistory,
  refreshHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
