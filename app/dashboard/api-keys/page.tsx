'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Copy, Key, Plus, Trash2, AlertCircle, Check } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [newKey, setNewKey] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data)
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      setError('Please enter a name for your API key')
      return
    }

    setCreating(true)
    setError('')
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })

      if (response.ok) {
        const data = await response.json()
        setNewKey(data.key)
        setNewKeyName('')
        fetchApiKeys()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create API key')
      }
    } catch (error) {
      setError('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const handleRevokeKey = async (keyId: string, keyName: string) => {
    if (!confirm(`Are you sure you want to revoke "${keyName}"? This cannot be undone.`)) return

    try {
      const response = await fetch(`/api/api-keys?id=${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchApiKeys()
      }
    } catch (error) {
      console.error('Error revoking API key:', error)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseDialog = () => {
    setCreateDialogOpen(false)
    setNewKeyName('')
    setNewKey(null)
    setError('')
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Keys</h1>
          <p className="text-muted-foreground mt-1">
            Manage your API keys for programmatic access
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {newKey ? 'Your API Key' : 'Create New API Key'}
              </DialogTitle>
              <DialogDescription>
                {newKey 
                  ? '⚠️ Copy this key now - it will only be shown once!' 
                  : 'Create a new API key for your application'}
              </DialogDescription>
            </DialogHeader>
            
            {newKey ? (
              <div className="space-y-4">
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Make sure to copy your API key now. You won't be able to see it again!
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Your API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newKey}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(newKey)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-xs text-muted-foreground">
                    Use this key in your Authorization header:
                  </p>
                  <code className="text-xs mt-1 block">
                    Authorization: Bearer {newKey.substring(0, 20)}...
                  </code>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="Production API Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                  />
                  <p className="text-xs text-muted-foreground">
                    A friendly name to help you identify this key
                  </p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              {newKey ? (
                <Button onClick={handleCloseDialog} className="w-full">
                  Done
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCloseDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateKey}
                    disabled={creating || !newKeyName.trim()}
                  >
                    {creating ? 'Creating...' : 'Create Key'}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            These keys allow you to authenticate API requests to SPAMRUN
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground mb-4">No API keys yet</p>
              <p className="text-sm text-muted-foreground mb-6">
                Create your first API key to start using the SPAMRUN API
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {key.key_prefix}...
                      </code>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {key.last_used_at ? formatDateTime(key.last_used_at) : 'Never'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(key.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={key.is_active ? 'default' : 'secondary'}>
                        {key.is_active ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {key.is_active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeKey(key.id, key.name)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* API Documentation Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>
            Start using the SPAMRUN API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">1. Make Your First Request</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`curl -X POST https://your-app.vercel.app/api/email-checker/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "subject": "Your email subject",
    "body": "Your email body content"
  }'`}
            </pre>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">2. Get Analysis Results</h4>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs">
{`{
  "spamScore": 25,
  "deliverabilityScore": 75,
  "estimatedInboxRate": 65,
  "verdict": "NEEDS_IMPROVEMENT",
  "analysis": {
    "spamIndicators": [...],
    "recommendations": [...],
    "positives": [...]
  }
}`}
            </pre>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <a href="/api-docs" target="_blank">
                View Full API Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
