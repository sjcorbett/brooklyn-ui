/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export function recentlyUsedServiceProvider() {
    return {
        $get: ['$log', function ($log) { return new RecentlyUsedService($log); }]
    }
}

export const PREFIX = 'org.apache.brooklyn.composer.lastUsed:';

function RecentlyUsedService($log) {
    let service = {};
    
    service.getId = (brooklynObject) => {
        if (typeof brooklynObject === 'string') return brooklynObject;
        return (brooklynObject.containingBundle || '?') + "::" + 
            (brooklynObject.symbolicName || '?') + ":" + (brooklynObject.version || '?');
    };
    
    service.markUsed = (item, when) => {
        let id = service.getId(item);
        if (when) {
            let old = service.getLastUsed(id);
            if (old > when) return;
        } else {
            when = Date.now();
        }
        sessionStorage.setItem(PREFIX+id, when);
        if (item.lastUsed) item.lastUsed = when;
    };
    service.getLastUsed = (item) => {
        let id = service.getId(item); 
        let s = sessionStorage.getItem(PREFIX+id); 
        return s ? ((Number)(s)) : -1; 
    };
    
    service.embellish = (item) => {
        item.lastUsed = service.getLastUsed(service.getId(item));
    };
    
    service.markUsed('io.cloudsoft.demo.bank.threetier:0.1.0-SNAPSHOT::db:0.1.0-SNAPSHOT', 100);
    
    return service;
}
