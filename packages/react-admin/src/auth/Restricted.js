import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userCheck } from '../actions/authActions';
import { getPermissions } from '../reducer';

/**
 * Restrict access to children
 *
 * Useful for Route components ; used internally by CrudRoute.
 * Use it to decorate your custom page components to require 
 * authentication or a custom role.
 * 
 * Pass the `location` from the `routeParams` as `location` prop.
 * You can set additional `authParams` at will if your authClient
 * requires it.
 *
 * @example
 *     import { Restricted } from 'react-admin';
 * 
 *     const CustomRoutes = [
 *         <Route path="/foo" render={routeParams =>
 *             <Restricted location={routeParams.location} authParams={{ foo: 'bar' }}>
 *                 <Foo />
 *             </Restricted>
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
export class Restricted extends Component {
    static propTypes = {
        authParams: PropTypes.object,
        children: PropTypes.element.isRequired,
        location: PropTypes.object,
        userCheck: PropTypes.func,
    };

    componentWillMount() {
        this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
        }
    }

    checkAuthentication(params) {
        const { userCheck, authParams, location, match } = params;
        userCheck(
            authParams,
            location && location.pathname,
            match && match.params
        );
    }

    // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)
    render() {
        const {
            children,
            userCheck,
            authParams,
            location,
            ...rest
        } = this.props;
        return React.cloneElement(children, rest);
    }
}

const mapStateToProps = (state, props) => {
    const { authParams, match } = props;
    return {
        permissions: getPermissions(state, {
            key: authParams.route,
            resource: authParams.resource,
            params: match ? match.params : undefined,
        }),
    };
};

export default connect(mapStateToProps, {
    userCheck,
})(Restricted);
