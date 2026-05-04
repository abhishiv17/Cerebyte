-- 🧠 Cerebyte Seed Data

-- Seed Problems (DSA Coding Challenges)
INSERT INTO public.problems (title, description, difficulty, topic, time_limit_ms, memory_limit_mb, test_cases, tags)
VALUES 
(
    'Two Sum', 
    'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.', 
    'Easy', 
    'Arrays', 
    2000, 
    256, 
    '[{"input": "[2,7,11,15], 9", "output": "[0,1]"}, {"input": "[3,2,4], 6", "output": "[1,2]"}]',
    '{"hash-table", "array"}'
),
(
    'Reverse Linked List', 
    'Given the `head` of a singly linked list, reverse the list, and return the reversed list.', 
    'Easy', 
    'Linked List', 
    2000, 
    256, 
    '[{"input": "[1,2,3,4,5]", "output": "[5,4,3,2,1]"}]',
    '{"recursion", "linked-list"}'
),
(
    'Longest Substring Without Repeating Characters', 
    'Given a string `s`, find the length of the longest substring without repeating characters.', 
    'Medium', 
    'Sliding Window', 
    2000, 
    256, 
    '[{"input": "abcabcbb", "output": "3"}, {"input": "bbbbb", "output": "1"}]',
    '{"string", "sliding-window"}'
),
(
    'Merge Intervals', 
    'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals.', 
    'Medium', 
    'Sorting', 
    2000, 
    256, 
    '[{"input": "[[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"}]',
    '{"array", "sorting"}'
),
(
    'Maximum Subarray', 
    'Given an integer array `nums`, find the subarray with the largest sum and return its sum.', 
    'Easy', 
    'Dynamic Programming', 
    2000, 
    256, 
    '[{"input": "[-2,1,-3,4,-1,2,1,-5,4]", "output": "6"}]',
    '{"array", "dynamic-programming"}'
),
(
    'Valid Parentheses', 
    'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.', 
    'Easy', 
    'Stack', 
    2000, 
    256, 
    '[{"input": "()[]{}", "output": "true"}, {"input": "(]", "output": "false"}]',
    '{"string", "stack"}'
);

-- Seed DSA Lessons (Interactive Tutorials)
INSERT INTO public.dsa_lessons (title, topic, content, big_o_time, big_o_space, "order")
VALUES
(
    'Introduction to Arrays', 
    'Arrays', 
    'An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together.', 
    'O(1) for access, O(N) for search', 
    'O(N) for storage', 
    1
),
(
    'Binary Search', 
    'Searching', 
    'Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.', 
    'O(log N)', 
    'O(1)', 
    2
),
(
    'Singly Linked Lists', 
    'Linked List', 
    'A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations.', 
    'O(N) for search, O(1) for insert at head', 
    'O(N)', 
    3
),
(
    'Understanding Big O Notation', 
    'Complexity', 
    'Big O notation is used to classify algorithms according to how their run time or space requirements grow as the input size grows.', 
    'N/A', 
    'N/A', 
    4
);

-- Seed DBMS Lessons (SQL Challenges)
INSERT INTO public.dbms_lessons (title, content, setup_sql, expected_output_rows, "order")
VALUES
(
    'Introduction to SQL', 
    'SQL (Structured Query Language) is used to communicate with a database. It is the standard language for relational database management systems.', 
    'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); INSERT INTO users (name) VALUES (''Alice''), (''Bob'');', 
    2, 
    1
),
(
    'The SELECT Statement', 
    'The SELECT statement is used to select data from a database. The data returned is stored in a result table, called the result-set.', 
    'CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL); INSERT INTO products (name, price) VALUES (''Laptop'', 1200), (''Mouse'', 25);', 
    2, 
    2
),
(
    'Filtering with WHERE', 
    'The WHERE clause is used to filter records. It is used to extract only those records that fulfill a specified condition.', 
    'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER); INSERT INTO users (name, age) VALUES (''Alice'', 25), (''Bob'', 30), (''Charlie'', 20);', 
    1, 
    3
),
(
    'Sorting with ORDER BY', 
    'The ORDER BY keyword is used to sort the result-set in ascending or descending order.', 
    'CREATE TABLE students (id INTEGER, name TEXT, grade INTEGER); INSERT INTO students VALUES (1, ''Alice'', 90), (2, ''Bob'', 85), (3, ''Charlie'', 95);', 
    3, 
    4
);
