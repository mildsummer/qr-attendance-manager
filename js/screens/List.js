import React, { Component } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getHistory, refreshHistory } from "../actions";
import colors from "../constants/colors";
import HistoryList from "../components/HistoryList";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%"
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
  componentDidMount() {
    const { data } = this.props;
    if (!data) {
      this.startLoading();
    }
  }

  startLoading = () => {
    const { data, getHistory } = this.props;
    getHistory(20, data && data.length ? data[data.length - 1] : null);
  };

  render() {
    const {
      data,
      hasGetAll,
      refreshHistory,
      isLoading,
      isRefreshing
    } = this.props;
    return (
      <View style={styles.container}>
        {data ? (
          <HistoryList
            data={data}
            hasGetAll={hasGetAll}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            refresh={refreshHistory}
            startLoading={this.startLoading}
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
  dbUser: state.user.data,
  data: state.history.data,
  hasGetAll: state.history.hasGetAll,
  isLoading: state.history.isLoading,
  isRefreshing: state.history.isRefreshing
});

const mapDispatchToProps = {
  getHistory,
  refreshHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
