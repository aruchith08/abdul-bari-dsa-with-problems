import csv
import json
import os
import re

DATA_FILE = 'src/data/abdulBariData.ts'
TARGET_CSV = 'Abdul_Bari_DSA_Curated_Problems.csv'

# Load 93 problems metadata (title, URL)
with open(DATA_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'export const ABDUL_BARI_PROBLEMS: DSAProblem\[\] = (\[[\s\S]*?\]);', content)
if not match:
    raise RuntimeError('Could not parse ABDUL_BARI_PROBLEMS')

problems_meta = json.loads(match.group(1))
assert len(problems_meta) == 93, f'Expected 93 problems, got {len(problems_meta)}'

# Define the curated problem mapping according to strict relevance:
# Format: id: {'hr': [...], 'lc': [...], 'cc': [...]}
curated_map = {
    1: {'hr': [], 'lc': [], 'cc': []},
    2: {'hr': [], 'lc': [], 'cc': []},
    3: {'hr': [], 'lc': [], 'cc': []},
    4: {
        'hr': ['https://www.hackerrank.com/challenges/simple-array-sum/problem'],
        'lc': ['https://leetcode.com/problems/running-sum-of-1d-array/'],
        'cc': ['https://www.codechef.com/problems/FLOW001']
    },
    5: {
        'hr': ['https://www.hackerrank.com/challenges/2d-array/problem'],
        'lc': ['https://leetcode.com/problems/matrix-diagonal-sum/'],
        'cc': []
    },
    6: {
        'hr': ['https://www.hackerrank.com/challenges/30-running-time-and-complexity/problem'],
        'lc': [],
        'cc': []
    },
    7: {
        'hr': ['https://www.hackerrank.com/challenges/30-running-time-and-complexity/problem'],
        'lc': ['https://leetcode.com/problems/sqrtx/'],
        'cc': []
    },
    8: {'hr': [], 'lc': [], 'cc': []},
    9: {'hr': [], 'lc': [], 'cc': []},
    10: {'hr': [], 'lc': [], 'cc': []},
    11: {'hr': [], 'lc': [], 'cc': []},
    12: {'hr': [], 'lc': [], 'cc': []},
    13: {'hr': [], 'lc': [], 'cc': []},
    14: {'hr': [], 'lc': [], 'cc': []},
    15: {'hr': [], 'lc': [], 'cc': []},
    16: {
        'hr': ['https://www.hackerrank.com/challenges/tutorial-intro/problem'],
        'lc': ['https://leetcode.com/problems/find-target-indices-after-sorting-array/'],
        'cc': ['https://www.codechef.com/problems/SEARCHINARRAY']
    },
    17: {
        'hr': [
            'https://www.hackerrank.com/challenges/merging-communities/problem',
            'https://www.hackerrank.com/challenges/components-in-graph/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/number-of-provinces/',
            'https://leetcode.com/problems/redundant-connection/'
        ],
        'cc': ['https://www.codechef.com/problems/DISHOWN']
    },
    18: {'hr': [], 'lc': [], 'cc': []},
    19: {'hr': [], 'lc': [], 'cc': []},
    20: {'hr': [], 'lc': [], 'cc': []},
    21: {'hr': [], 'lc': [], 'cc': []},
    22: {'hr': [], 'lc': [], 'cc': []},
    23: {'hr': [], 'lc': [], 'cc': []},
    24: {'hr': [], 'lc': [], 'cc': []},
    25: {'hr': [], 'lc': [], 'cc': []},
    26: {'hr': [], 'lc': [], 'cc': []},
    27: {'hr': [], 'lc': [], 'cc': []},
    28: {'hr': [], 'lc': [], 'cc': []},
    29: {'hr': [], 'lc': [], 'cc': []},
    30: {
        'hr': [
            'https://www.hackerrank.com/challenges/tutorial-intro/problem',
            'https://www.hackerrank.com/challenges/icecream-parlor/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/binary-search/',
            'https://leetcode.com/problems/search-insert-position/',
            'https://leetcode.com/problems/guess-number-higher-or-lower/'
        ],
        'cc': [
            'https://www.codechef.com/problems/BSEARCH1',
            'https://www.codechef.com/problems/TRICOIN'
        ]
    },
    31: {
        'hr': ['https://www.hackerrank.com/challenges/tutorial-intro/problem'],
        'lc': [
            'https://leetcode.com/problems/binary-search/',
            'https://leetcode.com/problems/first-bad-version/'
        ],
        'cc': ['https://www.codechef.com/problems/BSEARCH1']
    },
    32: {
        'hr': [
            'https://www.hackerrank.com/challenges/qheap1/problem',
            'https://www.hackerrank.com/challenges/jesse-and-cookies/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/kth-largest-element-in-an-array/',
            'https://leetcode.com/problems/last-stone-weight/',
            'https://leetcode.com/problems/sort-an-array/'
        ],
        'cc': ['https://www.codechef.com/problems/IPCTRAIN']
    },
    33: {
        'hr': ['https://www.hackerrank.com/challenges/correctness-invariant/problem'],
        'lc': ['https://leetcode.com/problems/merge-sorted-array/'],
        'cc': ['https://www.codechef.com/problems/MRGSRT']
    },
    34: {
        'hr': ['https://www.hackerrank.com/challenges/countingsort2/problem'],
        'lc': [
            'https://leetcode.com/problems/sort-an-array/',
            'https://leetcode.com/problems/sort-list/'
        ],
        'cc': ['https://www.codechef.com/problems/MRGSRT']
    },
    35: {
        'hr': ['https://www.hackerrank.com/challenges/ctci-merge-sort/problem'],
        'lc': ['https://leetcode.com/problems/reverse-pairs/'],
        'cc': ['https://www.codechef.com/problems/INVC_CNT']
    },
    36: {
        'hr': [
            'https://www.hackerrank.com/challenges/quicksort1/problem',
            'https://www.hackerrank.com/challenges/quicksort2/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/sort-an-array/',
            'https://leetcode.com/problems/kth-largest-element-in-an-array/'
        ],
        'cc': ['https://www.codechef.com/problems/TSORT']
    },
    37: {
        'hr': [
            'https://www.hackerrank.com/challenges/quicksort3/problem',
            'https://www.hackerrank.com/challenges/runningtime/problem'
        ],
        'lc': ['https://leetcode.com/problems/sort-an-array/'],
        'cc': ['https://www.codechef.com/problems/TSORT']
    },
    38: {'hr': [], 'lc': [], 'cc': []},
    39: {'hr': [], 'lc': [], 'cc': []},
    40: {
        'hr': [],
        'lc': ['https://leetcode.com/problems/maximum-units-on-a-truck/'],
        'cc': []
    },
    41: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/course-schedule-iii/',
            'https://leetcode.com/problems/maximum-profit-in-job-scheduling/'
        ],
        'cc': []
    },
    42: {
        'hr': ['https://www.hackerrank.com/challenges/jesse-and-cookies/problem'],
        'lc': ['https://leetcode.com/problems/minimum-cost-to-connect-sticks/'],
        'cc': []
    },
    43: {
        'hr': ['https://www.hackerrank.com/challenges/tree-huffman-decoding/problem'],
        'lc': [],
        'cc': []
    },
    44: {
        'hr': [
            'https://www.hackerrank.com/challenges/primsmstsub/problem',
            'https://www.hackerrank.com/challenges/kruskalmstrsub/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/min-cost-to-connect-all-points/',
            'https://leetcode.com/problems/connecting-cities-with-minimum-cost/'
        ],
        'cc': ['https://www.codechef.com/problems/MSTICK']
    },
    45: {
        'hr': ['https://www.hackerrank.com/challenges/dijkstrashortreach/problem'],
        'lc': [
            'https://leetcode.com/problems/network-delay-time/',
            'https://leetcode.com/problems/path-with-maximum-probability/',
            'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
        ],
        'cc': ['https://www.codechef.com/problems/SHPATH']
    },
    46: {'hr': [], 'lc': [], 'cc': []},
    47: {'hr': [], 'lc': [], 'cc': []},
    48: {'hr': [], 'lc': [], 'cc': []},
    49: {
        'hr': ['https://www.hackerrank.com/challenges/floyd-city-of-blinding-lights/problem'],
        'lc': [
            'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/',
            'https://leetcode.com/problems/course-schedule-iv/'
        ],
        'cc': []
    },
    50: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/burst-balloons/',
            'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/'
        ],
        'cc': []
    },
    51: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/burst-balloons/',
            'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/'
        ],
        'cc': []
    },
    52: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/burst-balloons/',
            'https://leetcode.com/problems/minimum-cost-tree-from-leaf-values/'
        ],
        'cc': []
    },
    53: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
            'https://leetcode.com/problems/network-delay-time/'
        ],
        'cc': []
    },
    54: {
        'hr': ['https://www.hackerrank.com/challenges/unbounded-knapsack/problem'],
        'lc': [
            'https://leetcode.com/problems/partition-equal-subset-sum/',
            'https://leetcode.com/problems/target-sum/',
            'https://leetcode.com/problems/ones-and-zeroes/'
        ],
        'cc': ['https://www.codechef.com/problems/PPTEST']
    },
    55: {
        'hr': ['https://www.hackerrank.com/challenges/unbounded-knapsack/problem'],
        'lc': [
            'https://leetcode.com/problems/partition-equal-subset-sum/',
            'https://leetcode.com/problems/target-sum/',
            'https://leetcode.com/problems/ones-and-zeroes/'
        ],
        'cc': ['https://www.codechef.com/problems/PPTEST']
    },
    56: {'hr': [], 'lc': [], 'cc': []},
    57: {'hr': [], 'lc': [], 'cc': []},
    58: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/shortest-path-visiting-all-nodes/',
            'https://leetcode.com/problems/find-the-shortest-superstring/'
        ],
        'cc': []
    },
    59: {'hr': [], 'lc': [], 'cc': []},
    60: {
        'hr': ['https://www.hackerrank.com/challenges/dynamic-programming-classics-the-longest-common-subsequence/problem'],
        'lc': [
            'https://leetcode.com/problems/longest-common-subsequence/',
            'https://leetcode.com/problems/shortest-common-supersequence/',
            'https://leetcode.com/problems/delete-operation-for-two-strings/'
        ],
        'cc': []
    },
    61: {
        'hr': [
            'https://www.hackerrank.com/challenges/bfsshortreach/problem',
            'https://www.hackerrank.com/challenges/connected-cell-in-a-grid/problem'
        ],
        'lc': [
            'https://leetcode.com/problems/number-of-islands/',
            'https://leetcode.com/problems/clone-graph/',
            'https://leetcode.com/problems/rotting-oranges/'
        ],
        'cc': ['https://www.codechef.com/problems/FIRESC']
    },
    62: {
        'hr': [],
        'lc': ['https://leetcode.com/problems/critical-connections-in-a-network/'],
        'cc': ['https://www.codechef.com/problems/GRAFFDEF']
    },
    63: {'hr': [], 'lc': [], 'cc': []},
    64: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/n-queens/',
            'https://leetcode.com/problems/n-queens-ii/'
        ],
        'cc': []
    },
    65: {
        'hr': ['https://www.hackerrank.com/challenges/recursive-digit-sum/problem'],
        'lc': [
            'https://leetcode.com/problems/subsets/',
            'https://leetcode.com/problems/subsets-ii/',
            'https://leetcode.com/problems/combination-sum/'
        ],
        'cc': []
    },
    66: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/is-graph-bipartite/',
            'https://leetcode.com/problems/possible-bipartition/'
        ],
        'cc': []
    },
    67: {
        'hr': [],
        'lc': ['https://leetcode.com/problems/find-the-shortest-superstring/'],
        'cc': []
    },
    68: {'hr': [], 'lc': [], 'cc': []},
    69: {'hr': [], 'lc': [], 'cc': []},
    70: {'hr': [], 'lc': [], 'cc': []},
    71: {'hr': [], 'lc': [], 'cc': []},
    72: {'hr': [], 'lc': [], 'cc': []},
    73: {'hr': [], 'lc': [], 'cc': []},
    74: {
        'hr': ['https://www.hackerrank.com/challenges/kmp-fp/problem'],
        'lc': [
            'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
            'https://leetcode.com/problems/shortest-palindrome/',
            'https://leetcode.com/problems/repeated-substring-pattern/'
        ],
        'cc': []
    },
    75: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
            'https://leetcode.com/problems/repeated-dna-sequences/',
            'https://leetcode.com/problems/longest-duplicate-substring/'
        ],
        'cc': []
    },
    76: {
        'hr': ['https://www.hackerrank.com/challenges/self-balancing-tree/problem'],
        'lc': ['https://leetcode.com/problems/balanced-binary-tree/'],
        'cc': []
    },
    77: {'hr': [], 'lc': [], 'cc': []},
    78: {'hr': [], 'lc': [], 'cc': []},
    79: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/design-hashmap/',
            'https://leetcode.com/problems/design-hashset/',
            'https://leetcode.com/problems/contains-duplicate/'
        ],
        'cc': []
    },
    80: {
        'hr': ['https://www.hackerrank.com/challenges/dijkstrashortreach/problem'],
        'lc': [
            'https://leetcode.com/problems/network-delay-time/',
            'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
        ],
        'cc': ['https://www.codechef.com/problems/SHPATH']
    },
    81: {
        'hr': ['https://www.hackerrank.com/challenges/bfsshortreach/problem'],
        'lc': [
            'https://leetcode.com/problems/number-of-islands/',
            'https://leetcode.com/problems/clone-graph/'
        ],
        'cc': ['https://www.codechef.com/problems/FIRESC']
    },
    82: {
        'hr': ['https://www.hackerrank.com/challenges/tower-of-hanoi/problem'],
        'lc': [],
        'cc': ['https://www.codechef.com/problems/HANOI']
    },
    83: {
        'hr': [],
        'lc': ['https://leetcode.com/problems/reshape-the-matrix/'],
        'cc': []
    },
    84: {
        'hr': ['https://www.hackerrank.com/challenges/ctci-merge-sort/problem'],
        'lc': ['https://leetcode.com/problems/sort-an-array/'],
        'cc': ['https://www.codechef.com/problems/MRGSRT']
    },
    85: {'hr': [], 'lc': [], 'cc': []},
    86: {'hr': [], 'lc': [], 'cc': []},
    87: {
        'hr': ['https://www.hackerrank.com/challenges/java-stdin-and-stdout-1/problem'],
        'lc': [],
        'cc': ['https://www.codechef.com/problems/START01']
    },
    88: {
        'hr': ['https://www.hackerrank.com/challenges/java-datatypes/problem'],
        'lc': [],
        'cc': ['https://www.codechef.com/problems/FLOW001']
    },
    89: {
        'hr': ['https://www.hackerrank.com/challenges/welcome-to-java/problem'],
        'lc': [],
        'cc': ['https://www.codechef.com/problems/START01']
    },
    90: {'hr': [], 'lc': [], 'cc': []},
    91: {'hr': [], 'lc': [], 'cc': []},
    92: {
        'hr': ['https://www.hackerrank.com/challenges/welcome-to-java/problem'],
        'lc': [],
        'cc': ['https://www.codechef.com/problems/START01']
    },
    93: {
        'hr': [],
        'lc': [
            'https://leetcode.com/problems/shortest-path-visiting-all-nodes/',
            'https://leetcode.com/problems/find-the-shortest-superstring/'
        ],
        'cc': []
    }
}

# Open target CSV and write one by one
with open(TARGET_CSV, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['ID', 'Title', 'Video URL', 'HackerRank', 'LeetCode', 'CodeChef'])
    
    for p in problems_meta:
        pid = p['id']
        title = p['title']
        vurl = p['videoUrl']
        
        cur = curated_map.get(pid, {'hr': [], 'lc': [], 'cc': []})
        hr_str = '\n'.join(cur['hr']) if cur['hr'] else 'None'
        lc_str = '\n'.join(cur['lc']) if cur['lc'] else 'None'
        cc_str = '\n'.join(cur['cc']) if cur['cc'] else 'None'
        
        writer.writerow([pid, title, vurl, hr_str, lc_str, cc_str])
        f.flush()
        print(f"Processed [{pid:2d}/93]: {title} (HR: {len(cur['hr'])}, LC: {len(cur['lc'])}, CC: {len(cur['cc'])})")

print(f"\nAll 93 videos successfully curated and written to {TARGET_CSV}!")
