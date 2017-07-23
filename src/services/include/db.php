<?php
/*!
 * qwp: https://github.com/steem/qwp
 *
 * Copyright (c) 2015 Steem
 * Released under the MIT license
 */
require_once(DRUPAL_DB_ROOT . '/database.inc');

global $QWP_ACTIVE_DB;
if (isset($QWP_ACTIVE_DB)) {
    db_set_active($QWP_ACTIVE_DB);
}
function qwp_db_try_connect_db() {
    try {
        db_query('select version()')->execute();
    } catch (PDOException $e) {
        log_db_exception($e, "try_connect_db");
        db_remove_active();
    }
}
function qwp_db_and_from_array(&$ids, $field = 'id', $op = '=') {
    $ret = '(';
    $sep = '';
    foreach ($ids as &$id) {
        $ret .= $sep . "$field{$op}'$id'";
        if (!$sep) $sep = ' and ';
    }
    return $ret . ')';
}
function qwp_db_or_from_array(&$ids, $field = 'id', $op = '=') {
    $ret = '(';
    $sep = '';
    foreach ($ids as &$id) {
        $ret .= $sep . "$field{$op}'$id'";
        if (!$sep) $sep = ' or ';
    }
    return $ret . ')';
}
function qwp_db_error_is_duplicated(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 1062;
}
function qwp_db_error_is_connection_gone(&$pdo_exception) {
    return $pdo_exception->errorInfo[1] == 2006;
}
function qwp_db_has_record($table_name, $where = null, $conditions = null) {
    $query = db_select($table_name, 't');
    if ($where) {
        $query->where($where);
    }
    if ($conditions) {
        foreach ($conditions as $con) {
            $query->condition($con[0], $con[1], isset($con[2]) ? $con[2] : null);
        }
    }
    $query->addExpression("count(1)", "n");
    $result = $query->execute();
    if ($result && $result->rowCount() > 0) {
        $r = $result->fetchAssoc();
        return intval($r["n"]) > 0;
    }
    return false;
}
function qwp_db_records_count($table_name, $where = null, $conditions = null) {
    $query = db_select($table_name, 't');
    if ($where) {
        $query->where($where);
    }
    if ($conditions) {
        foreach ($conditions as $con) {
            $query->condition($con[0], $con[1], isset($con[2]) ? $con[2] : null);
        }
    }
    $query->addExpression("count(1)", "n");
    $result = $query->execute();
    if ($result && $result->rowCount() > 0) {
        $r = $result->fetchAssoc();
        return intval($r["n"]);
    }
    return 0;
}
function qwp_db_get_one_record($table_name, $fields, $conditions, $where = null) {
    $query = db_select($table_name, 't')->fields('t', $fields);
    if ($conditions) {
        foreach ($conditions as $con) {
            $query->condition($con[0], $con[1], isset($con[2]) ? $con[2] : null);
        }
    }
    if ($where) {
        $query->where($where);
    }
    $result = $query->execute();
    return $result->rowCount() === 0 ? false : $result->fetchAssoc();
}
function qwp_db_get_fields_from_modal(&$modal, &$fields) {
    $fields = array();
    foreach ($modal as $idx => &$item) {
        if ($idx === 'alias' || !isset($item['table'])) {
            continue;
        }
        $table = $item['table'];
        if (!isset($fields[$table])) {
            $fields[$table] = array();
        }
        foreach ($item as $k => $v) {
            if ($k === 'table' || $k === 'group') {
                continue;
            } else if (is_string($v)) {
                if (strpos($v, ',') !== false) {
                    $fields[$table] = array_merge($fields[$table], explode(',', $v));
                } else {
                    $fields[$table][] = $v;
                }
            } else if ($v[0]) {
                $fields[$table][] = $v[0];
            }
        }
    }
}
function qwp_db_get_table_header_from_modal(&$modal, &$header) {
    $header = array(
        'names' => array(),
    );
    $groups = array();
    $has_alias = isset($modal['alias']);
    if ($has_alias) {
        $header['fields'] = array();
    }
    foreach ($modal as $idx => &$item) {
        if ($idx === 'alias') {
            continue;
        }
        $table = isset($item['table']) ? $item['table'] : '';
        $is_complex_arr = false;
        $group_fields = array();
        $group_name = false;
        foreach ($item as $k => $v) {
            if ($k === 'table') {
                continue;
            }
            if ($k === 'group') {
                $group_name = $v[0];
                $groups[$group_name] = array($v[1]);
                continue;
            }
            $is_string = is_string($v);
            if ($is_string && ($table || $is_complex_arr)) continue;
            if ($is_string) $v = $item;
            if (count($v) == 1) continue;
            if ($has_alias) {
                $ak = $table . '.' . $v[0];
                $header['fields'][] = $ak;
                if ($has_alias) $group_fields[] = $ak;
                if (isset($modal['alias'][$ak])) {
                    $v[0] = $modal['alias'][$ak];
                }
            } else {
                $group_fields[] = $v[0];
            }
            $header['names'][] = $v;
            if ($is_string) break;
            if (!$is_complex_arr) $is_complex_arr = !$is_string;
        }
        if ($group_name) $groups[$group_name][] = $group_fields;
    }
    if (count($groups) > 0) $header['group'] = $groups;
}
function qwp_db_calc_data_count(&$query) {
    return intval($query->countQuery()->execute()->fetchField());
}
function qwp_db_set_search_condition_internal(&$field_values, &$query, &$allow_empty, &$field_conditions) {
    $op = "and";
    if (isset($field_conditions["op"])) {
        $op = $field_conditions["op"];
    }
    if ($op == "or") {
        $obj = db_or();
    } else {
        $obj = &$query;
    }
    if (isset($field_conditions["condition"])) {
        qwp_db_set_search_condition_internal($field_values, $obj, $allow_empty, $field_conditions["condition"]);
    }
    $has_fields = false;
    if (isset($field_conditions["fields"])) {
        foreach ($field_conditions["fields"] as $field => &$field_con) {
            if (!isset($field_values[$field])) {
                continue;
            }
            $value = $field_values[$field];
            unset($field_values[$field]);
            $is_empty = $value === '';
            if ($is_empty && !isset($allow_empty[$field])) {
                continue;
            }
            $has_fields = true;
            if (is_array($value)) {
                if ($field_con == 'in') {
                    $obj->condition($field, $value, $field_con);
                } else if ($field_con == '[]') {
                    $obj->condition($field, $value[0], '>=');
                    $obj->condition($field, $value[1], '<=');
                } else if ($field_con == '(]') {
                    $obj->condition($field, $value[0], '>');
                    $obj->condition($field, $value[1], '<=');
                } else if ($field_con == '[)') {
                    $obj->condition($field, $value[0], '>=');
                    $obj->condition($field, $value[1], '<');
                } else if ($field_con == '()') {
                    $obj->condition($field, $value[0], '>');
                    $obj->condition($field, $value[1], '<');
                }
            } else if ($field_con == 'like') {
                if (strpos($value, '%') === false && strpos($value, '?') === false) {
                    $value = '%' . $value . '%';
                }
                $obj->condition($field, $value, $field_con);
            } else if ($field_con == 'null') {
                $obj->isNull($field);
            } else if ($field_con == 'not null') {
                $obj->isNotNull($field);
            } else {
                if (is_array($field_con) && isset($field_con[$value])) {
                    $fn_con = $field_con[$value];
                    if (is_array($fn_con) && !isset($fn_con['where'])) {
                        $value = $fn_con[1];
                        $fn_con = $fn_con[0];
                    }
                } else if (is_string($field_con) && function_exists($field_con)) {
                    $fn_con = $field_con;
                } else {
                    $fn_con = null;
                }
                if ($fn_con && is_string($fn_con) && function_exists($fn_con)) {
                    $fn_con = $fn_con($value);
                }
                if (is_array($fn_con) && isset($fn_con['where'])) {
                    $obj->where($fn_con['where']);
                    continue;
                }
                if ($fn_con == 'null') {
                    $obj->isNull($field);
                } else if ($fn_con == 'not null') {
                    $obj->isNotNull($field);
                } else {
                    $obj->condition($field, $value, $fn_con);
                }
            }
        }
    }
    if ($op == "or") {
        if ($has_fields) {
            $query->condition($obj);
        } else {
            unset($obj);
        }
    }
}
function qwp_db_set_search_condition(&$query, &$field_values, &$field_conditions) {
    $allow_empty = array();
    if ($field_conditions) {
        if (isset($field_conditions["allow empty"])) {
            $allow_empty = $field_conditions["allow empty"];
        }
        qwp_db_set_search_condition_internal($field_values, $query, $allow_empty, $field_conditions);
    }
    foreach ($field_values as $field => $value) {
        if ($value === '' && !isset($allow_empty[$field])) {
            continue;
        }
        if (is_array($value)) {
            $query->condition($field, $value[0], '>=');
            $query->condition($field, $value[1], '<=');
        } else {
            $query->condition($field, $value);
        }
    }
}
function qwp_db_set_fields(&$query, &$table, &$fields, &$options) {
    if ($fields === '*') {
        $query->fields($table);
    } else if (is_string($fields)) {
        $query->fields($table, explode(',', $fields));
    } else {
        if ($options && isset($options['alias'])) {
            foreach ($fields as $table_alias => &$field) {
                if (is_number($table_alias)) {
                    $table_alias = $table;
                    $field_prefix = '';
                } else {
                    $field_prefix = $table_alias . '.';
                }
                if ($field === '*') {
                    $query->fields($table_alias);
                } else if (is_array($field)) {
                    $remain_fields = array();
                    foreach ($field as $item) {
                        $alias_key = $field_prefix . $item;
                        if (isset($options['alias'][$alias_key])) {
                            $query->addField($table_alias, $item, $options['alias'][$alias_key]);
                        } else {
                            $remain_fields[] = $item;
                        }
                    }
                    if (count($remain_fields) > 0) {
                        $query->fields($table_alias, $field);
                    }
                } else {
                    $alias_key = $field_prefix . $field;
                    if (isset($options['alias'][$alias_key])) {
                        $query->addField($table_alias, $field, $options['alias'][$alias_key]);
                    } else {
                        $query->addField($table_alias, $field);
                    }
                }
            }
        } else {
            foreach ($fields as $table_alias => $field) {
                if ($field === '*') {
                    $query->fields($table_alias);
                } else if (is_array($field)) {
                    $query->fields($table_alias, $field);
                } else {
                    $query->fields($table_alias, explode(',', $field));
                }
            }
        }
    }
}
/*
$table_name -> string or array
$fields -> * or string or array
$options -> array(
    'left join' => array(), optional
    'order by' => array(), optional
    'default order' => array(), optional, if oder by is set, it will be ignored
    'group by' => ,string optional
    'where' => string, optional
    'search condition' => array(
        'values' => array() optional
        'condition' => array( optional
            'op' => 'or' or 'and', optional, default is 'and',
            'fields' => array(
                for field search condition,
            ),
            'condition' => optional, for recursive condition
        )
    ),
    'alias' => array(
        $k => $v
    )
)*/
function qwp_create_query(&$query, $table_name, &$fields, &$options = null) {
    if (is_string($table_name)) {
        $table_alias = $table_name;
        $query = db_select($table_name);
    } else if (is_array($table_name)) {
        $table_alias = $table_name[1];
        $query = db_select($table_name[0], $table_alias);
    } else {
        return;
    }
    qwp_db_set_fields($query, $table_alias, $fields, $options);
    if ($options) {
        if (isset($options['left join'])) {
            foreach($options['left join'] as &$join) {
                $query->leftJoin($join[0], $join[1], $join[2]);
            }
        }
        if (isset($options['inner join'])) {
            foreach($options['inner join'] as &$join) {
                $query->innerJoin($join[0], $join[1], $join[2]);
            }
        }
        if (isset($options['where'])) {
            if (is_string($options['where'])) {
                $query->where($options['where']);
            } else {
                foreach ($options['where'] as &$where) {
                    $query->where($where);
                }
            }
        }
        if (isset($options['search condition'])) {
            if (isset($options['search condition']['values']) && count($options['search condition']['values']) > 0) {
                $field_conditions = null;
                if (isset($options['search condition']['condition'])) {
                    $field_conditions = &$options['search condition']['condition'];
                }
                qwp_db_set_search_condition($query, $options['search condition']['values'], $field_conditions);
            }
        }
        if (isset($options['order by'])) {
            foreach($options['order by'] as &$order_by) {
                if (is_string($order_by)) {
                    $query->orderBy($order_by);
                } else {
                    if (count($order_by) == 2 && $order_by[1]) {
                        $query->orderBy($order_by[0], $order_by[1]);
                    } else {
                        $query->orderBy($order_by[0]);
                    }
                }
            }
        }
        if (isset($options['group by'])) {
            if(isset($options['group count'])){
                $query->addExpression("count(1)", $options['group count']);
            }
            if(isset($options['group sum'])){
                $query->addExpression("SUM(".$options['group sum'].")", $options['group sum']);
            }
            $query->groupBy($options['group by']);
        }
    }
    if (isset($options['limits']) && $options['limits']) {
        if (is_array($options['limits'])) $query->range($options['limits'][0], $options['limits'][1]);
        else $query->range(0, $options['limits']);
    }
    if (isset($options['random']) && $options['random']) {
        $query->orderBy('RAND()');
    }
}
function qwp_db_set_pager(&$query, $total) {
    $page = P('page', 1);
    if (!$page || $page < 0) {
        $page = 1;
    }
    $page_size = P('psize', 30);
    if (!$page_size || $page_size < 0) {
        $page_size = 30;
    }
    $total_page = ceil($total / $page_size);
    if ($page > $total_page && P('cpage', true)) $page = $total_page;
    $page_start = ($page - 1) * $page_size;
    $query->range($page_start, $page_size);
    return $page;
}
function qwp_db_init_order_by(&$options) {
    $sort_field = P("sortf");
    if ($sort_field) {
        $sort = P("sort");
        $sort = array(
            array($sort_field, $sort)
        );
        if (isset($options['order by'])) {
            $options['order by'] = array_merge($sort, $options['order by']);
        } else {
            $options['order by'] = $sort;
        }
    } else if (isset($options['default order'])) {
        $options['order by'] = $options['default order'];
        unset($options['default order']);
    }
}
function qwp_db_init_search_params(&$options) {
    global $S;
    if (!count($S)) {
        return;
    }
    $tmp_search = array();
    foreach ($S as $k => $v) {
        $tmp_search[$k] = $v;
    }
    if (isset($options['search validator'])) {
        require_once(QWP_CORE_ROOT . '/validator.php');
        $tmp_v = null;
        qwp_validate_data($tmp_search, $options['search validator'], $tmp_v, true);
    }
    if (isset($options['search converter'])) {
        $options['search converter']($tmp_search);
    }
    if (!isset($options['search condition'])) {
        $options['search condition'] = array();
    }
    if (isset($options['search condition']['values'])) {
        copy_from($options['search condition']['values'], $tmp_search);
    } else {
        $options['search condition']['values'] = $tmp_search;
    }
}
function qwp_db_retrieve_data($table_name, &$data, &$options)
{
    if (isset($options['data modal'])) {
        qwp_db_get_fields_from_modal($options['data modal'], $fields);
        if (isset($options['data modal']['alias'])) {
            if (isset($options['alias'])) {
                copy_from($options['alias'], $options['data modal']['alias']);
            } else {
                $options['alias'] = $options['data modal']['alias'];
            }
        }
    } else {
        $fields = $options['fields'];
    }
    qwp_db_init_order_by($options);
    qwp_db_init_search_params($options);
    qwp_create_query($query, $table_name, $fields, $options);
    $enable_pager = P('enable_pager', true, $options);
    $total = 0;
    if ($enable_pager) $total = qwp_db_calc_data_count($query);
    if (!is_array($data)) $data = array();
    if (isset($data["data"])) {
        $data["total"] = $total + count($data["data"]);
    } else {
        $data["total"] = $total;
        $data["data"] = array();
    }
    if (!$enable_pager || ($enable_pager && $total > 0)) {
        if ($enable_pager) {
            $data['page'] = qwp_db_set_pager($query, $total);
        }
        $result = $query->execute();
        if (isset($options['data converter'])) {
            $data_converter = $options['data converter'];
            while (($r = $result->fetchAssoc())) {
                $data_converter($r);
                $data["data"][] = $r;
            }
        } else {
            while (($r = $result->fetchAssoc())) {
                $data["data"][] = $r;
            }
        }
        if (!$enable_pager) $data["total"] = count($data["data"]);
    }
}
// if $options is string, it will be treated as where
function qwp_db_get_data($table_name, &$data, $fields, &$options = null) {
    if (!$options) {
        $options = array();
    }
    if (is_string($options)) {
        $options = array(
            'where' => $options
        );
    }
    if (!$fields) {
        qwp_db_get_fields_from_modal($options['data modal'], $fields);
    }
    if (isset($options['data modal'])) {
        if (isset($options['data modal']['alias'])) {
            if (isset($options['alias'])) {
                copy_from($options['alias'], $options['data modal']['alias']);
            } else {
                $options['alias'] = $options['data modal']['alias'];
            }
        }
    }
    $data = array();
    qwp_db_init_order_by($options);
    qwp_db_init_search_params($options);
    qwp_create_query($query, $table_name, $fields, $options);
    $result = $query->execute();
    $data = array();
    if ($result->rowCount() > 0) {
        $is_flat = isset($options['flat']);
        if (isset($options['data converter'])) {
            $data_converter = $options['data converter'];
            while (($r = $result->fetchAssoc())) {
                $data_converter($r);
                if ($is_flat) {
                    $data[] = $r[$fields];
                } else {
                    $data[] = $r;
                }
            }
        } else {
            while (($r = $result->fetchAssoc())) {
                if ($is_flat) {
                    $data[] = $r[$fields];
                } else {
                    $data[] = $r;
                }
            }
        }
    }
}