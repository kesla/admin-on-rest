import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import admin, {
    getResources as getAdminResources,
    getPermissions as getAdminPermissions,
} from './admin';
import localeReducer from './locale';

export default (customReducers, locale) =>
    combineReducers({
        admin,
        locale: localeReducer(locale),
        form: formReducer,
        routing: routerReducer,
        ...customReducers,
    });

export const getResources = state => getAdminResources(state.admin);

/**
 * @typedef {Object} getPermissionsOptions
 * @property {string} key. The key. May be a route path
 * @property {string} resource. The resource, if applicable.
 * @property {Object} params. The route parameters, if applicable.
 */

/**
 * Get the permissions 
 * @param {Object} state. The current state.
 * @param {getPermissionsOptions} options. An object with options describing the context for which the permissions must be retrieved.
 * 
 * @example
 * // Gets the permissions for a route which has parameters
 * const mapStateToProps = (state, props) => ({
 *     permissions: getPermissions(state, {
 *         key: props.match.path,
 *         params: props.match.params,
 *     }),
 * })
 */
export const getPermissions = (
    state,
    /** @type {getPermissionsOptions} */
    options
) => getAdminPermissions(state.admin, options);
