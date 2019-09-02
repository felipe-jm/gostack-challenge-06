import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Starred extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('starred').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const starred = navigation.getParam('starred');

    return (
      <>
        <WebView source={{ uri: starred.html_url }} style={{ flex: 1 }} />
      </>
    );
  }
}
