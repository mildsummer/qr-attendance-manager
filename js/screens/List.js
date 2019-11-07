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
    return (
      <View style={styles.container}>
        {data ? (
          <HistoryList
            data={data}
            hasGetAll={hasGetAll}
            isLoading={isLoading}
            isRefreshing={isRefreshing}
            refresh={this.refresh}
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
  hasGetAll: state.history.hasGetAll
});

const mapDispatchToProps = {
  getHistory,
  refreshHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
