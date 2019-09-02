import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  AlignLoading,
} from './styles';

export default class Main extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    this.getData();

    this.setState({
      loading: true,
    });
  }

  getData = async () => {
    const { navigation } = this.props;
    const { stars, page } = this.state;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    this.setState({
      stars: [...stars, ...response.data],
      loading: false,
      page: page + 1,
      refreshing: false,
    });
  };

  refreshData = () => {
    this.setState({
      stars: [],
      page: 1,
      loading: true,
      refreshing: true,
    });

    this.getData();
  };

  handleNavigation = starred => {
    const { navigation } = this.props;

    navigation.navigate('Starred', { starred });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <AlignLoading>
            <ActivityIndicator color="#7159c1" size={50} />
          </AlignLoading>
        ) : (
          <Stars
            data={stars}
            onEndReachedTreshold={1.0}
            onEndReached={stars.length === 30 && this.getData}
            onRefresh={this.refreshData}
            refreshing={refreshing}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred
                onPress={() => {
                  this.handleNavigation(item);
                }}
              >
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
