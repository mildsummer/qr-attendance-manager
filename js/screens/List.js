import React, { Component } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { getHistory } from '../redux';
import { HISTORY_TYPE_GUEST } from '../../functions/constants/common';

class List extends Component {
  constructor(props) {
    super(props);
    this.startLoading = this.startLoading.bind(this);
    this.state = {
      isLoading: false
    };
  }

  componentDidMount() {
    const { data } = this.props;
    if (!data) {
      this.startLoading();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        isLoading: false
      })
    }
  }

  startLoading() {
    const { data, getHistory } = this.props;
    this.setState({
      isLoading: true
    }, () => {
      getHistory(20, (data && data.length) ? data[data.length - 1] : null);
    });
  }

  render() {
    const { dbUser, data, hasGetAll } = this.props;
    const { isLoading } = this.state;
    const isLoadingEnabled = !isLoading && !hasGetAll;
    console.log(data);
    return (
      <View
        style={{
          flex: 1,
          height: '100%'
        }}
      >
        {data ? (
          <FlatList
            data={data}
            keyExtractor={(item, index) => (index.toString())}
            renderItem={({ item }) => (
              <ListItem
                title={`[${item.type === HISTORY_TYPE_GUEST ? 'GUEST' : 'HOST'}] ${new Date(item.createdAt.seconds * 1000).toString()}`}
                subtitle={`${item.type === HISTORY_TYPE_GUEST ? item.hostName : item.guestName}(${item.email})`}
                bottomDivider
              />
            )}
            onEndReached={isLoadingEnabled ? this.startLoading : null}
            onEndReachedThreshold={0}
            ListFooterComponent={hasGetAll ? null : (
              <ActivityIndicator
                size="large"
                style={{
                  marginTop: 16,
                  marginBottom: 16
                }}
              />
            )}
          />
        ) : (
          <ActivityIndicator
            size='large'
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0
            }}
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
  getHistory
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List);
